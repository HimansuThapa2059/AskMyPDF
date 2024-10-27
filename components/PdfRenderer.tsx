"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useResizeDetector } from "react-resize-detector";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCwIcon,
  Search,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import SimpleBar from "simplebar-react";
import PdfFullscreen from "./PdfFullscreen";
import { useToast } from "@/hooks/use-toast";
// import "simplebar-react/dist/simplebar.min.css";

const PdfRenderer = ({ fileUrl }: { fileUrl: string }) => {
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currPage, setCurrPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const isLoading = renderedScale !== scale;

  const { width, ref } = useResizeDetector();
  const { toast } = useToast();

  const pageValidation = z.object({
    pageNo: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= totalPages),
  });
  type pageValidationTypes = z.infer<typeof pageValidation>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<pageValidationTypes>({
    defaultValues: {
      pageNo: "1",
    },
    resolver: zodResolver(pageValidation),
  });

  const handlePageSubmit = ({ pageNo }: pageValidationTypes) => {
    setCurrPage(+pageNo);
    setValue("pageNo", String(pageNo));
  };

  return (
    <div className="flex w-full flex-col items-center rounded-md bg-white shadow">
      {/* For header section of PDF */}
      <div className="flex h-14 w-full items-center justify-between border-b border-zinc-200 px-2">
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            aria-label="previous-page"
            disabled={currPage <= 1}
            onClick={() => {
              setCurrPage((c) => {
                const newPage = c - 1 > 1 ? c - 1 : 1;
                setValue("pageNo", String(newPage));
                return newPage;
              });
            }}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input
              {...register("pageNo")}
              className={cn(
                "h-8 w-10 focus-visible:ring-slate-300",
                errors.pageNo && "focus-visible:ring-red-500",
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
            />

            <p className="space-x-1 text-sm text-zinc-700">
              <span>/</span>
              <span>{totalPages}</span>
            </p>
          </div>

          <Button
            variant="ghost"
            aria-label="previous-page"
            disabled={currPage >= totalPages}
            onClick={() => {
              setCurrPage((c) => {
                const newPage = c + 1 > totalPages ? totalPages : c + 1;
                setValue("pageNo", String(newPage));
                return newPage;
              });
            }}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="focus-visible:ring-slate-300"
            >
              <Button aria-label="zoom" variant={"ghost"} className="gap-1">
                <Search className="h-4 w-4" />
                <span> {scale * 100}%</span>
                <ChevronDown className="ml-2 h-4 w-4 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={() => {
                  setScale(0.75);
                }}
              >
                75%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setScale(1);
                }}
              >
                100%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setScale(1.5);
                }}
              >
                150%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setScale(2);
                }}
              >
                200%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={"ghost"}
            aria-label="rotate"
            onClick={() => setRotation((cur) => (cur + 90) % 360)}
          >
            <RotateCwIcon className="h-4 w-4" />
          </Button>

          <PdfFullscreen fileUrl={fileUrl} />
        </div>
      </div>

      {/* For PDF Section */}

      <div className="max-h-[screen] w-full flex-1">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          <div ref={ref}>
            <Document
              file={fileUrl}
              loading={
                <div className="flex min-h-[calc(100vh-10rem)] w-full items-center justify-center">
                  <Loader2 className="h-14 w-14 animate-spin text-indigo-500" />
                </div>
              }
              onLoadError={() =>
                toast({
                  title: "Error loading pdf",
                  description: "Please try again later",
                  variant: "destructive",
                })
              }
              onLoadSuccess={({ numPages }) => {
                setTotalPages(numPages);
              }}
              className={"max-h-full"}
            >
              {isLoading && renderedScale ? (
                <Page
                  width={width ? width : 1}
                  pageNumber={currPage}
                  scale={scale}
                  key={"@" + renderedScale}
                  rotate={rotation}
                  className={"flex justify-center"}
                />
              ) : null}

              <Page
                width={width ? width : 1}
                pageNumber={currPage}
                scale={scale}
                key={"@" + scale}
                rotate={rotation}
                className={cn("flex justify-center", isLoading ? "hidden" : "")}
                loading={
                  <div className="flex min-h-[calc(100vh-10rem)] w-full items-center justify-center">
                    <Loader2 className="h-14 w-14 animate-spin text-indigo-500" />
                  </div>
                }
                onRenderSuccess={() => setRenderedScale(scale)}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfRenderer;

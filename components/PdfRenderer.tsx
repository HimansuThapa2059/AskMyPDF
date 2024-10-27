"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useResizeDetector } from "react-resize-detector";
import { toast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, Loader2, Search } from "lucide-react";
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
// import "simplebar-react/dist/simplebar.min.css";

const PdfRenderer = ({ fileUrl }: { fileUrl: string }) => {
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currPage, setCurrPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);

  const { width, ref } = useResizeDetector();

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
      <div className="flex h-14 w-full items-center justify-between border-b border-zinc-200 px-2">
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            aria-label="previous-page"
            disabled={currPage <= 1}
            onClick={() => {
              setCurrPage((c) => (c - 1 > 1 ? c - 1 : 1));
            }}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input
              value={currPage}
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
              setCurrPage((c) => (c + 1 > totalPages ? totalPages : c + 1));
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
        </div>
      </div>

      <div className="max-h-[screen] w-full flex-1">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          <div ref={ref}>
            <Document
              file={fileUrl}
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
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
              <Page
                width={width ? width : 1}
                pageNumber={currPage}
                scale={scale}
                className={"flex justify-center"}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfRenderer;

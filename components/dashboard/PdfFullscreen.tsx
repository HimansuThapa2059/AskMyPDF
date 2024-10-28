import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Expand, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SimpleBar from "simplebar-react";
import { Document, Page } from "react-pdf";
import { useToast } from "@/hooks/use-toast";
import { useResizeDetector } from "react-resize-detector";

const PdfFullscreen = ({ fileUrl }: { fileUrl: string }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);

  const { toast } = useToast();
  const { width, ref } = useResizeDetector();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(o) => {
        if (!o) {
          setIsOpen(o);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button aria-label="fullscreen" variant={"ghost"} className="gap-1.5">
          <Expand className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-7xl">
        <SimpleBar autoHide={false} className="mt-6 max-h-[calc(100vh-10rem)]">
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
              {new Array(totalPages).fill(0).map((_, i) => (
                <Page
                  key={i}
                  width={width ? width : 1}
                  pageNumber={i + 1}
                  className={"flex justify-center"}
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullscreen;

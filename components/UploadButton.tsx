"use client";
import { useState } from "react";
import Dropzone from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { CloudUpload, File, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface UploadDropzoneProps {
  closeDialog: () => void;
}

const UploadDropzone: React.FC<UploadDropzoneProps> = ({ closeDialog }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const router = useRouter();
  const { toast } = useToast();
  const { startUpload } = useUploadThing("pdfUploader");

  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((cur) => {
        if (cur >= 90) {
          clearInterval(interval);
          return cur;
        } else {
          return cur + 5;
        }
      });
    }, 500);

    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFiles) => {
        setIsUploading(true);

        const progressInterval = startSimulatedProgress();

        // handle file upload
        const res = await startUpload(acceptedFiles);

        if (!res) {
          closeDialog();
          return toast({
            title: "File Size Exceeded",
            description:
              "Consider upgrading your plan to upload larger PDF files",
            variant: "destructive",
          });
        }

        const [fileResponse] = res;
        const fileKey = fileResponse.key;
        const fileId = fileResponse.serverData.fileId;

        if (!fileId || !fileKey) {
          closeDialog();
          return toast({
            title: "Something went wrong",
            description: "Please try again later",
            variant: "destructive",
          });
        }

        console.log(res);

        if (fileId) router.push(`/dashboard/${fileId}`);

        clearInterval(progressInterval);
        setUploadProgress(100);
      }}
    >
      {({ getInputProps, getRootProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="m-4 h-64 rounded-lg border border-dashed border-gray-300"
        >
          <div className="flex h-full w-full items-center justify-center">
            <label
              htmlFor="dropzone-file"
              className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <input
                  type="file"
                  id="dropzone-file "
                  className="hidden"
                  {...getInputProps()}
                />
                <CloudUpload className="mb-2 h-12 w-12 text-zinc-600" />
                <p className="mb-2 text-sm text-zinc-800">
                  Drag and Drop pdf or{" "}
                  <span className="text-blue-500 underline">Choose pdf</span>
                </p>

                <p className="text-xs text-zinc-500">upto 4 MB</p>
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <div className="flex max-w-xs items-center divide-x divide-zinc-200 overflow-hidden rounded-md bg-white outline-1 outline-zinc-200">
                  <div className="grid h-full place-items-center px-3 py-2">
                    <File className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div className="h-full truncate px-3 py-2 text-sm">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {isUploading ? (
                <div className="mx-auto mt-4 w-full max-w-xs">
                  <Progress
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : ""
                    }
                    value={uploadProgress}
                    className="h-1 w-full bg-zinc-200"
                  />
                  {uploadProgress === 100 && (
                    <div className="flex items-center justify-center gap-1 pt-2 text-center text-sm text-zinc-700">
                      <Loader2 className="h-3 w-3 animate-spin" />{" "}
                      Redirecting...
                    </div>
                  )}
                </div>
              ) : null}
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog open={isOpen ? true : false} onOpenChange={setIsOpen}>
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button>Upload PDF</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle></DialogTitle> {/* no title */}
        <UploadDropzone closeDialog={() => setIsOpen(false)} />
        <DialogDescription></DialogDescription> {/* no description */}
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;

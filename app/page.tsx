import Link from "next/link";
import { MoveRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { steps } from "@/constants";

export default function Home() {
  return (
    <>
      <div className="max-container mb-12 mt-28 flex flex-col items-center justify-center text-center sm:mt-40">
        <div className="mx-auto mb-4 flex max-w-fit cursor-pointer items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-6 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
          <div className="flex items-center justify-between gap-1 text-sm font-semibold text-gray-700">
            <Image
              src={"/ai-stars.png"}
              alt=""
              height={18}
              width={18}
              className="dark:invert dark:filter"
            />
            <span>AskMyPDF is available now!</span>
          </div>
        </div>
        <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
          Chat with your <span className="text-indigo-600">documents</span> in
          seconds.
        </h1>
        <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
          <span className="text-indigo-600">AskMyPDF</span> allows you to have
          conversations with any PDF document. Simply upload your file and start
          asking questions right away.
        </p>
        <Link
          className={buttonVariants({
            size: "lg",
            className: "mt-5 bg-indigo-950",
          })}
          href="/dashboard"
          // target="_blank"
        >
          Get started <MoveRight className="ml-1 h-5 w-5" />
        </Link>
      </div>

      <div>
        <div className="relative isolate">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>

          <div>
            <div className="mx-auto max-w-6xl px-10 lg:px-8">
              <div className="mt-16 flow-root sm:mt-24">
                <div className="-m-2 rounded-xl bg-gray-900/25 p-0.5 ring-1 ring-inset ring-gray-900/20 md:p-1 lg:-m-4">
                  <Image
                    src="/dashboard-preview.jpg"
                    alt="product preview"
                    width={1364}
                    height={866}
                    quality={100}
                    className="rounded-[10px] bg-white p-2 shadow-2xl ring-1 ring-gray-900/20 sm:p-8 md:rounded-[9px] md:p-20"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto mb-32 mt-28 max-w-5xl sm:mt-56">
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mt-2 text-4xl font-bold text-gray-900 sm:text-5xl">
              Start chatting in minutes
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Chatting to your PDF files has never been easier than with
              AskMyPDF.
            </p>
          </div>
        </div>

        {/* steps */}

        <ol className="my-8 space-y-4 p-4 md:flex md:space-x-12 md:space-y-0 md:px-8">
          {steps.map((step) => (
            <li className="md:flex-1" key={step.number}>
              <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4 lg:items-center">
                <span className="text-sm font-semibold text-indigo-600">
                  Step {step.number}
                </span>
                <span className="text-xl font-semibold">{step.title}</span>
                <span className="mt-2 text-zinc-700 lg:text-center">
                  {step.description}{" "}
                  {step.linkHref && step.linkLabel && (
                    <Link
                      href={step.linkHref}
                      className="text-indigo-700 underline underline-offset-2"
                    >
                      {step.linkLabel}
                    </Link>
                  )}
                </span>
              </div>
            </li>
          ))}
        </ol>

        <div className="relative mx-auto max-w-6xl px-12 lg:px-8">
          <div className="mt-16 flow-root sm:mt-24">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-20 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-60"
            >
              <div
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
                className="relative right-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] translate-x-1/3 rotate-[65deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:right-[calc(50%-36rem)] sm:w-[72.1875rem]"
              />
            </div>
            <div className="-m-2 rounded-xl bg-gray-900/25 p-0.5 ring-1 ring-inset ring-gray-900/20 md:p-1 lg:-m-4">
              <Image
                src="/file-upload-preview.jpg"
                alt="uploading preview"
                width={1419}
                height={732}
                quality={100}
                className="rounded-[10px] bg-white p-2 shadow-2xl ring-1 ring-gray-900/10 sm:p-8 md:rounded-[9px] md:p-20"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

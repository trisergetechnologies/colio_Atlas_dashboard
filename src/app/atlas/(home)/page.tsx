export default function Home() {
  return (
    <div className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 md:p-12">
      {/* Background blur orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-black/20 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-7xl xl:text-8xl">
          Colio Atlas
        </h1>

        <p className="mt-4 text-base font-medium text-white/90 sm:text-lg md:text-xl">
          Welcome to the Colio Dashboard
        </p>

        <p className="mt-6 max-w-2xl mx-auto text-sm text-white/80 md:text-base">
          Monitor performance, manage operations, and gain real-time insights —
          all from one powerful administrative control center.
        </p>
      </div>
    </div>
  );
}


  








// import { PaymentsOverview } from "@/components/Charts/payments-overview";
// import { UsedDevices } from "@/components/Charts/used-devices";
// import { WeeksProfit } from "@/components/Charts/weeks-profit";
// import { TopChannels } from "@/components/Tables/top-channels";
// import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
// import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
// import { Suspense } from "react";
// import { ChatsCard } from "./_components/chats-card";
// import { OverviewCardsGroup } from "./_components/overview-cards";
// import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
// import { RegionLabels } from "./_components/region-labels";

// type PropsType = {
//   searchParams: Promise<{
//     selected_time_frame?: string;
//   }>;
// };

// export default async function Home({ searchParams }: PropsType) {
//   const { selected_time_frame } = await searchParams;
//   const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

//   return (
//     <>
//       <Suspense fallback={<OverviewCardsSkeleton />}>
//         <OverviewCardsGroup />
//       </Suspense>

//       <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
//         <PaymentsOverview
//           className="col-span-12 xl:col-span-7"
//           key={extractTimeFrame("payments_overview")}
//           timeFrame={extractTimeFrame("payments_overview")?.split(":")[1]}
//         />

//         <WeeksProfit
//           key={extractTimeFrame("weeks_profit")}
//           timeFrame={extractTimeFrame("weeks_profit")?.split(":")[1]}
//           className="col-span-12 xl:col-span-5"
//         />

//         <UsedDevices
//           className="col-span-12 xl:col-span-5"
//           key={extractTimeFrame("used_devices")}
//           timeFrame={extractTimeFrame("used_devices")?.split(":")[1]}
//         />

//         <RegionLabels />

//         <div className="col-span-12 grid xl:col-span-8">
//           <Suspense fallback={<TopChannelsSkeleton />}>
//             <TopChannels />
//           </Suspense>
//         </div>

//         <Suspense fallback={null}>
//           <ChatsCard />
//         </Suspense>
//       </div>
//     </>
//   );
// }

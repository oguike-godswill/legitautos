"use client";

import { HeroScene } from "../scenes/HeroScene";
import { StatementScene } from "../scenes/StatementScene";
import { JourneyScene } from "../scenes/JourneyScene";
import { ServicesScene } from "../scenes/ServicesScene";
import { ImageTransitionsScene } from "../scenes/ImageTransitionsScene";
import { MetricsScene } from "../scenes/MetricsScene";
import { ReliabilityScene } from "../scenes/ReliabilityScene";
import { GlobalNetworkScene } from "../scenes/GlobalNetworkScene";
import { InsightsScene } from "../scenes/InsightsScene";
import { FinalScene } from "../scenes/FinalScene";
import { FeaturedScene } from "../scenes/FeaturedScene";

export function CinematicLanding() {
  return (
    <div className="bg-dark">
      <HeroScene />
      <StatementScene />
      <FeaturedScene />
      <JourneyScene />
      <ServicesScene />
      <ImageTransitionsScene />
      <MetricsScene />
      <ReliabilityScene />
      <GlobalNetworkScene />
      <InsightsScene />
      <FinalScene />
    </div>
  );
}

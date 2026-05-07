"use client";

import { Challenge } from "@/lib/challenges";
import { OrderRunner } from "./OrderRunner";
import { SplitRunner } from "./SplitRunner";
import { ImposterRunner } from "./ImposterRunner";
import { AttentionTargetRunner } from "./AttentionTargetRunner";
import { LossCurveRunner } from "./LossCurveRunner";
import { BuildRunner } from "./BuildRunner";
import { PositionPuzzleRunner } from "./PositionPuzzleRunner";
import { FindGapRunner } from "./FindGapRunner";
import { TempMatchRunner } from "./TempMatchRunner";
import { GauntletRunner } from "./GauntletRunner";

export function ChallengeFor({
  challenge,
  onPass,
  onAttempt,
}: {
  challenge: Challenge;
  onPass: (stars: number, perfect: boolean) => void;
  onAttempt: () => void;
}) {
  switch (challenge.kind) {
    case "build":
      return (
        <BuildRunner
          title={challenge.title}
          tagline={challenge.tagline}
          starter={challenge.starter}
          rounds={challenge.rounds}
          reveal={challenge.reveal}
          onPass={onPass}
          onAttempt={onAttempt}
        />
      );
    case "order":
      return (
        <OrderRunner
          title={challenge.title}
          tagline={challenge.tagline}
          prompt={challenge.prompt}
          items={challenge.items}
          rationale={challenge.rationale}
          onPass={onPass}
          onAttempt={onAttempt}
        />
      );
    case "split":
      return (
        <SplitRunner
          title={challenge.title}
          tagline={challenge.tagline}
          prompt={challenge.prompt}
          sentence={challenge.sentence}
          correctSplits={challenge.correctSplits}
          tolerance={challenge.tolerance}
          rationale={challenge.rationale}
          onPass={onPass}
          onAttempt={onAttempt}
        />
      );
    case "imposter":
      return (
        <ImposterRunner
          title={challenge.title}
          tagline={challenge.tagline}
          rounds={challenge.rounds}
          onPass={onPass}
          onAttempt={onAttempt}
        />
      );
    case "position-puzzle":
      return (
        <PositionPuzzleRunner
          title={challenge.title}
          tagline={challenge.tagline}
          prompt={challenge.prompt}
          tokens={challenge.tokens}
          reveal={challenge.reveal}
          onPass={onPass}
          onAttempt={onAttempt}
        />
      );
    case "attention-target":
      return (
        <AttentionTargetRunner
          title={challenge.title}
          tagline={challenge.tagline}
          rounds={challenge.rounds}
          onPass={onPass}
          onAttempt={onAttempt}
        />
      );
    case "find-gap":
      return (
        <FindGapRunner
          title={challenge.title}
          tagline={challenge.tagline}
          pieces={challenge.pieces}
          rounds={challenge.rounds}
          onPass={onPass}
          onAttempt={onAttempt}
        />
      );
    case "loss-curve":
      return (
        <LossCurveRunner
          title={challenge.title}
          tagline={challenge.tagline}
          rounds={challenge.rounds}
          onPass={onPass}
          onAttempt={onAttempt}
        />
      );
    case "temp-match":
      return (
        <TempMatchRunner
          title={challenge.title}
          tagline={challenge.tagline}
          buckets={challenge.buckets}
          samples={challenge.samples}
          rationale={challenge.rationale}
          onPass={onPass}
          onAttempt={onAttempt}
        />
      );
    case "gauntlet":
      return (
        <GauntletRunner
          title={challenge.title}
          tagline={challenge.tagline}
          stages={challenge.stages}
          onPass={onPass}
          onAttempt={onAttempt}
        />
      );
  }
}

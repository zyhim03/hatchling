"use client";

import { Chapter } from "@/lib/chapters";
import { IntroWidget } from "./IntroWidget";
import { ArchitectureWidget } from "./ArchitectureWidget";
import { TokenizerWidget } from "./TokenizerWidget";
import { EmbeddingsWidget } from "./EmbeddingsWidget";
import { PositionalWidget } from "./PositionalWidget";
import { AttentionWidget } from "./AttentionWidget";
import { BlockWidget } from "./BlockWidget";
import { FullModelWidget } from "./FullModelWidget";
import { TrainingWidget } from "./TrainingWidget";
import { InferenceWidget } from "./InferenceWidget";
import { HatchWidget } from "./HatchWidget";

export function WidgetFor({
  chapter,
  onComplete,
}: {
  chapter: Chapter;
  onComplete: () => void;
}) {
  switch (chapter.widget) {
    case "intro":
      return <IntroWidget onComplete={onComplete} />;
    case "architecture":
      return <ArchitectureWidget onComplete={onComplete} />;
    case "tokenizer":
      return <TokenizerWidget onComplete={onComplete} />;
    case "embeddings":
      return <EmbeddingsWidget onComplete={onComplete} />;
    case "positional":
      return <PositionalWidget onComplete={onComplete} />;
    case "attention":
      return <AttentionWidget onComplete={onComplete} />;
    case "block":
      return <BlockWidget onComplete={onComplete} />;
    case "fullModel":
      return <FullModelWidget onComplete={onComplete} />;
    case "training":
      return <TrainingWidget onComplete={onComplete} />;
    case "inference":
      return <InferenceWidget onComplete={onComplete} />;
    case "hatch":
      return <HatchWidget onComplete={onComplete} />;
    default:
      return null;
  }
}

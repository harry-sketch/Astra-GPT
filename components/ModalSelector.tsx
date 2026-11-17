"use client";

import { memo, useCallback, useState } from "react";
import { CheckIcon, Lock } from "lucide-react";

import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/modal-selector";
import { cn } from "@/lib/utils";
import type { TModelId } from "../model/model.types";
import { useStore } from "../store/useStore";
import type { TModeType } from "../types";

const models: TModeType[] = [
  {
    chef: "OpenAI",
    chefSlug: "openai",
    id: "gpt-6-luna",
    name: "GPT 6 Luna",
    providers: ["openai"],
    isProOnly: false,
  },
  {
    chef: "OpenAI",
    chefSlug: "openai",
    id: "gpt-5.4-nano",
    name: "GPT 5 nano",
    providers: ["openai"],
    isProOnly: true,
  },
  {
    chef: "Google",
    chefSlug: "google",
    id: "gemini-3.8-flash",
    name: "Gemini 3.8 Flash",
    providers: ["google"],
    isProOnly: true,
  },
  {
    chef: "Anthropic",
    chefSlug: "anthropic",
    id: "claude-fable-5-2",
    name: "Claude Fable 5",
    providers: ["anthropic"],
    isProOnly: true,
  },
];

interface ModelItemProps {
  model: (typeof models)[0];
  selectedModel: TModelId;
  onSelect: (id: TModelId) => void;
  isLocked: boolean;
}

const ModelItem = memo(
  ({ model, selectedModel, onSelect, isLocked }: ModelItemProps) => {
    const handleSelect = useCallback(() => {
      if (isLocked) return;
      onSelect(model.id);
    }, [onSelect, model.id, isLocked]);

    return (
      <ModelSelectorItem
        key={model.id}
        onSelect={handleSelect}
        value={model.id}
        disabled={isLocked}
        className={cn(
          "flex items-center gap-2",
          isLocked && "opacity-50 cursor-not-allowed text-muted-foreground",
        )}
      >
        <ModelSelectorLogo provider={model.chefSlug} />
        <ModelSelectorName>{model.name}</ModelSelectorName>
        <ModelSelectorLogoGroup className={cn(isLocked && "opacity-50")}>
          {model.providers.map((provider) => (
            <ModelSelectorLogo key={provider} provider={provider} />
          ))}
        </ModelSelectorLogoGroup>

        {/* Status Indicators */}
        <div className="ml-auto flex items-center justify-end w-5">
          {isLocked ? (
            <Lock className="size-4 text-muted-foreground" />
          ) : selectedModel === model.id ? (
            <CheckIcon className="size-4" />
          ) : null}
        </div>
      </ModelSelectorItem>
    );
  },
);

ModelItem.displayName = "ModelItem";

export const ModelSelectorComponent = () => {
  const [open, setOpen] = useState(false);

  const { selectedModel, setSelectedModel } = useStore();

  const userHaveProPlan = false;

  const handleModelSelect = (id: TModelId) => {
    setSelectedModel(id);
    setOpen(false);
  };

  const selectedModelData = models.find((model) => model.id === selectedModel);

  // Get unique chefs in order of appearance
  const chefs = [...new Set(models.map((model) => model.chef))];

  return (
    <div className="flex size-full items-center justify-center">
      <ModelSelector onOpenChange={setOpen} open={open}>
        <ModelSelectorTrigger>
          <div className="w-50 justify-between">
            <div className="flex items-center gap-2">
              {selectedModelData?.chefSlug && (
                <ModelSelectorLogo provider={selectedModelData.chefSlug} />
              )}
              {selectedModelData?.name && (
                <ModelSelectorName>{selectedModelData.name}</ModelSelectorName>
              )}
            </div>
          </div>
        </ModelSelectorTrigger>
        <ModelSelectorContent>
          <ModelSelectorInput placeholder="Search models..." />
          <ModelSelectorList>
            <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
            {chefs.map((chef) => (
              <ModelSelectorGroup heading={chef} key={chef}>
                {models
                  .filter((model) => model.chef === chef)
                  .map((model) => {
                    // Determine if the current model should be locked
                    // If the query is pending, data is undefined, so Pro models default to locked
                    const isLocked = model.isProOnly && !userHaveProPlan;

                    return (
                      <ModelItem
                        key={model.id}
                        model={model}
                        onSelect={handleModelSelect}
                        selectedModel={selectedModel}
                        isLocked={isLocked}
                      />
                    );
                  })}
              </ModelSelectorGroup>
            ))}
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    </div>
  );
};

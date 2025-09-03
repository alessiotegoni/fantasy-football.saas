"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ActionButton from "@/components/ActionButton";
import { GripVertical, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuction } from "@/contexts/AuctionProvider";
import { CSS } from "@dnd-kit/utilities";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AuctionParticipant } from "../queries/auctionParticipant";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { updateParticipantsOrder } from "../actions/auctionParticipant";

export default function ChangeOrderDialog() {
  const { auction, participants } = useAuction();

  const [orderedParticipants, setOrderedParticipants] = useState(participants);

  useEffect(() => {
    setOrderedParticipants(participants);
  }, [participants]);

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;

    if (!over || active.id === over.id) return;

    const oldIndex = orderedParticipants.findIndex(
      (p) => p.id === (active.id as string)
    );
    const newIndex = orderedParticipants.findIndex(
      (p) => p.id === (over.id as string)
    );

    const newOrderedParticipants = arrayMove(
      orderedParticipants,
      oldIndex,
      newIndex
    );

    setOrderedParticipants(newOrderedParticipants);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="justify-start text-sm !px-2 py-1.5 rounded-lg"
        >
          <ListOrdered />
          Cambia ordine
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambia ordine partecipanti</DialogTitle>
        </DialogHeader>
        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext
            strategy={verticalListSortingStrategy}
            items={participants.map((p) => p.id)}
          >
            {orderedParticipants.map((participant) => (
              <SortableParticipant
                key={participant.id}
                participant={participant}
              />
            ))}
          </SortableContext>
        </DndContext>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="w-full min-w-25 sm:w-fit">
              Chiudi
            </Button>
          </DialogClose>
          <ActionButton
            loadingText="Salvo"
            className="w-full min-w-25 sm:w-fit"
            action={updateParticipantsOrder.bind(null, {
              auctionId: auction.id,
              participantsIds: orderedParticipants.map((p) => p.id),
            })}
          >
            Salva
          </ActionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SortableParticipant({
  participant,
}: {
  participant: AuctionParticipant;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: participant.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      className="flex items-center gap-2"
    >
      <GripVertical />
      {participant.team?.name}
    </div>
  );
}

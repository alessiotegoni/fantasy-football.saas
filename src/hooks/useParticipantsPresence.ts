import { useAuction } from "@/contexts/AuctionProvider";
import { createClient } from "@/services/supabase/client/supabase";
import {
  REALTIME_SUBSCRIBE_STATES,
  RealtimeChannel,
} from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";

export default function useParticipantsPresence() {
  const { auction, userTeamId } = useAuction();

  const [onlineParticipants, setOnlineParticipants] = useState<string[]>([]);

  const supabase = createClient();
  const subscriptionRef = useRef<RealtimeChannel | null>(null);

  function trackPresence() {
    const presenceChannel = supabase.channel(`auction:${auction.id}-presence`, {
      config: {
        presence: {
          key: userTeamId,
        },
      },
    });

    const handleSetOnlineParticipants = () => {
      const newState = presenceChannel.presenceState();
      const participantsTeamsIds = Object.keys(newState);

      if (participantsTeamsIds.length) {
        setOnlineParticipants(participantsTeamsIds);
      }
    };

    const handleTrack = async (status: REALTIME_SUBSCRIBE_STATES) => {
      if (status !== REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) return;
      await presenceChannel.track({});
    };

    const subscription = presenceChannel
      .on("presence", { event: "sync" }, handleSetOnlineParticipants)
      .subscribe(handleTrack);

    subscriptionRef.current = subscription;
  }

  function untrackPresence() {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
  }

  useEffect(() => {
    if (userTeamId) trackPresence();

    return () => untrackPresence();
  }, [auction.id, userTeamId]);

  return { onlineParticipants };
}

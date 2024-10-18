//hooks/use-vapi.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!;

interface Assistant {
  name: string;
  id: string;
}

const assistants: Assistant[] = [
  { name: 'Woman', id: 'ebee6718-ed99-46be-bbce-66ac2244b8ef' },
  { name: 'Men', id: '3e37d33e-4139-434c-bea5-df9fb8f9441a' },
  { name: 'Spanish', id: '1d2500bc-94ae-4e45-b3d1-13980ed3da22' },
];

const useVapi = () => {
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [conversation, setConversation] = useState<{ role: string, text: string }[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState(assistants[0].id);
  const vapiRef = useRef<any>(null);

  const initializeVapi = useCallback(() => {
    if (!vapiRef.current) {
      const vapiInstance = new Vapi(publicKey);
      vapiRef.current = vapiInstance;

      vapiInstance.on('call-start', () => {
        setIsSessionActive(true);
      });

      vapiInstance.on('call-end', () => {
        setIsSessionActive(false);
        setConversation([]);
      });

      vapiInstance.on('volume-level', (volume: number) => {
        setVolumeLevel(volume);
      });

      vapiInstance.on('message', (message: any) => {
        if (message.type === 'transcript' && message.transcriptType === 'final') {
          setConversation((prev) => [
            ...prev,
            { role: message.role, text: message.transcript },
          ]);
        }
      });

      vapiInstance.on('error', (e: Error) => {
        console.error('Vapi error:', e);
      });
    }
  }, []);

  useEffect(() => {
    initializeVapi();
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current = null;
      }
    };
  }, [initializeVapi]);

  const toggleCall = async () => {
    try {
      if (isSessionActive) {
        await vapiRef.current.stop();
      } else {
        await vapiRef.current.start(selectedAssistant);
      }
    } catch (err) {
      console.error('Error toggling Vapi session:', err);
    }
  };

  const selectAssistant = (assistantId: string) => {
    setSelectedAssistant(assistantId);
  };

  return { volumeLevel, isSessionActive, conversation, toggleCall, assistants, selectedAssistant, selectAssistant };
};

export default useVapi;

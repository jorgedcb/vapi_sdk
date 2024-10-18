import React from 'react';

interface Assistant {
  name: string;
  id: string;
}

interface AssistantDropdownProps {
  assistants: Assistant[];
  selectedAssistant: string;
  onSelectAssistant: (assistantId: string) => void;
}

const AssistantDropdown: React.FC<AssistantDropdownProps> = ({
  assistants,
  selectedAssistant,
  onSelectAssistant,
}) => {
  return (
    <select
      value={selectedAssistant}
      onChange={(e) => onSelectAssistant(e.target.value)}
      className="absolute top-4 left-4 z-10 bg-white text-black p-2 rounded"
    >
      {assistants.map((assistant) => (
        <option key={assistant.id} value={assistant.id}>
          {assistant.name}
        </option>
      ))}
    </select>
  );
};

export default AssistantDropdown;

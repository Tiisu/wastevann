
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlasticType } from '@/utils/web3Utils';

interface WasteTypeSelectorProps {
  value: PlasticType;
  onValueChange: (value: PlasticType) => void;
}

const WasteTypeSelector: React.FC<WasteTypeSelectorProps> = ({ value, onValueChange }) => {
  return (
    <Select
      value={value.toString()}
      onValueChange={(val) => onValueChange(parseInt(val))}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select plastic type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Plastic Types</SelectLabel>
          <SelectItem value={PlasticType.PET.toString()}>PET - Polyethylene terephthalate</SelectItem>
          <SelectItem value={PlasticType.HDPE.toString()}>HDPE - High-density polyethylene</SelectItem>
          <SelectItem value={PlasticType.PVC.toString()}>PVC - Polyvinyl chloride</SelectItem>
          <SelectItem value={PlasticType.LDPE.toString()}>LDPE - Low-density polyethylene</SelectItem>
          <SelectItem value={PlasticType.PP.toString()}>PP - Polypropylene</SelectItem>
          <SelectItem value={PlasticType.PS.toString()}>PS - Polystyrene</SelectItem>
          <SelectItem value={PlasticType.OTHER.toString()}>Other plastics</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default WasteTypeSelector;

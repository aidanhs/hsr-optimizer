import React from "react";
import DisplayFormControl from "components/optimizerForm/conditionals/DisplayFormControl";
import { FormSwitchWithPopover } from "components/optimizerForm/conditionals/FormSwitch";
import { SuperImpositionLevel } from "types/LightCone";
import { PrecomputedCharacterConditional } from "types/CharacterConditional";
import { Form } from 'types/Form';
import { LightConeConditional } from "types/LightConeConditionals";
import getContentFromLCRanks from "../getContentFromLCRank";


export default (s: SuperImpositionLevel): LightConeConditional => {
  const sValues = [0.08, 0.09, 0.10, 0.11, 0.12];
  const lcRanks = {
    "id": "21002",
    "skill": "At This Very Moment",
    "desc": "After entering battle, increases All-Type RES of all allies by #2[i]%. Effects of the same type cannot stack.",
    "params": [[0.16, 0.08], [0.18, 0.09], [0.2, 0.1], [0.22, 0.11], [0.24, 0.12]],
    "properties": [[{"type": "DefenceAddedRatio", "value": 0.16}], [{"type": "DefenceAddedRatio", "value": 0.18}], [{"type": "DefenceAddedRatio", "value": 0.2}], [{"type": "DefenceAddedRatio", "value": 0.22}], [{"type": "DefenceAddedRatio", "value": 0.24}]]
  };
  const content = [{
    lc: true,
    id: 'dmgResBuff',
    name: 'dmgResBuff',
    formItem: FormSwitchWithPopover,
    text: 'Dmg RES buff',
    title: lcRanks.skill,
    content: getContentFromLCRanks(s, lcRanks),
  }];

  return {
    display: () => <DisplayFormControl content={content} />,
    defaults: () => ({
      dmgResBuff: true,
    }),
    precomputeEffects: (x: PrecomputedCharacterConditional, request: Form) => {
      const r = request.lightConeConditionals

      x.DMG_RED_MULTI *= (r.dmgResBuff) ? (1 - sValues[s]) : 0
    },
    calculatePassives: (/*c, request */) => { },
    calculateBaseMultis: (/* c, request */) => { }
  }
}
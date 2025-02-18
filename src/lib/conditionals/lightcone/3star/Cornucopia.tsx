import React from "react";
import { Stats } from 'lib/constants'
import DisplayFormControl from "components/optimizerForm/conditionals/DisplayFormControl";
import { FormSwitchWithPopover } from "components/optimizerForm/conditionals/FormSwitch";
import { SuperImpositionLevel } from "types/LightCone";
import { PrecomputedCharacterConditional } from "types/CharacterConditional";
import { Form } from 'types/Form';
import { LightConeConditional } from "types/LightConeConditionals";
import getContentFromLCRanks from "../getContentFromLCRank";


export default (s: SuperImpositionLevel): LightConeConditional => {
  const sValues = [0.12, 0.15, 0.18, 0.21, 0.24];
  const lcRanks = {
    "id": "20001",
    "skill": "Prosperity",
    "desc": "When the wearer uses their Skill or Ultimate, their Outgoing Healing increases by #1[i]%.",
    "params": [
      [
        0.12
      ],
      [
        0.15
      ],
      [
        0.18
      ],
      [
        0.21
      ],
      [
        0.24
      ]
    ],
    "properties": [
      [],
      [],
      [],
      [],
      []
    ]
  };
  const content = [{
    lc: true,
    id: 'healingBuff',
    name: 'healingBuff',
    formItem: FormSwitchWithPopover,
    text: 'Healing buff',
    title: lcRanks.skill,
    content: getContentFromLCRanks(s, lcRanks),
  }];

  return {
    display: () => <DisplayFormControl content={content} />,
    defaults: () => ({
      healingBuff: true,
    }),
    precomputeEffects: (x:PrecomputedCharacterConditional, request: Form) => {
      const r = request.lightConeConditionals

      x[Stats.OHB] += (r.healingBuff) ? sValues[s] : 0
    },
    calculatePassives: (/*c, request */) => { },
    calculateBaseMultis: (/* c, request */) => { }
  }
}

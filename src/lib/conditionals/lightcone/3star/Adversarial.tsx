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
  const sValues = [0.10, 0.12, 0.14, 0.16, 0.18];
  const lcRanks = {
    "id": "20014",
    "skill": "Alliance",
    "desc": "When the wearer defeats an enemy, increases SPD by #1[i]% for #2[i] turn(s).",
    "params": [
      [
        0.1,
        2
      ],
      [
        0.12,
        2
      ],
      [
        0.14,
        2
      ],
      [
        0.16,
        2
      ],
      [
        0.18,
        2
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
    id: 'defeatedEnemySpdBuff',
    name: 'defeatedEnemySpdBuff',
    formItem: FormSwitchWithPopover,
    text: 'Defeated enemy SPD buff',
    title: lcRanks.skill,
    content: getContentFromLCRanks(s, lcRanks),
  }];

  return {
    display: () => <DisplayFormControl content={content} />,
    defaults: () => ({
      defeatedEnemySpdBuff: true,
    }),
    precomputeEffects: (x: PrecomputedCharacterConditional, request: Form) => {
      const r = request.lightConeConditionals

      x[Stats.SPD_P] += (r.defeatedEnemySpdBuff) ? sValues[s] : 0
    },
    calculatePassives: (/*c, request */) => { },
    calculateBaseMultis: (/* c, request */) => { }
  }
}

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
  const sValues = [0.24, 0.30, 0.36, 0.42, 0.48];
  const lcRanks = {
    "id": "20020",
    "skill": "Genius",
    "desc": "When the wearer uses their Ultimate, increases ATK by #1[i]% for #2[i] turn(s).",
    "params": [[0.24, 2], [0.3, 2], [0.36, 2], [0.42, 2], [0.48, 2]],
    "properties": [[], [], [], [], []]
  };
  const content = [{
    lc: true,
    id: 'postUltAtkBuff',
    name: 'postUltAtkBuff',
    formItem: FormSwitchWithPopover,
    text: 'Post ult ATK buff',
    title: lcRanks.skill,
    content: getContentFromLCRanks(s, lcRanks),
  }];

  return {
    display: () => <DisplayFormControl content={content} />,
    defaults: () => ({
      postUltAtkBuff: true,
    }),
    precomputeEffects: (x: PrecomputedCharacterConditional, request: Form) => {
      const r = request.lightConeConditionals

      x[Stats.ATK_P] += (r.postUltAtkBuff) ? sValues[s] : 0
    },
    calculatePassives: (/*c, request */) => { },
    calculateBaseMultis: (/* c, request */) => { }
  }
}

import React from "react";
import { Stats } from "lib/constants";
import DisplayFormControl from "components/optimizerForm/conditionals/DisplayFormControl";
import { FormSliderWithPopover } from "components/optimizerForm/conditionals/FormSlider";
import { FormSwitchWithPopover } from "components/optimizerForm/conditionals/FormSwitch";

import { SuperImpositionLevel } from "types/LightCone";
import { PrecomputedCharacterConditional } from "types/CharacterConditional";
import { Form } from 'types/Form';
import { ConditionalLightConeMap } from "types/LightConeConditionals";
import getContentFromLCRanks from "../getContentFromLCRank";


const lcRank = {
  "id": "23020",
  "skill": "Mental Training",
  "desc": "For every debuff on the enemy target, the wearer's CRIT DMG dealt against this target increases by #2[i]%, stacking up to #3[i] times.",
  "params": [
    [0.2, 0.08, 3, 0.36, 0.24, 2],
    [0.23, 0.09, 3, 0.42, 0.28, 2],
    [0.26, 0.1, 3, 0.48, 0.32, 2],
    [0.29, 0.11, 3, 0.54, 0.36, 2],
    [0.32, 0.12, 3, 0.6, 0.4, 2]
  ],
  "properties": [
    [{"type": "CriticalDamageBase", "value": 0.2}],
    [{"type": "CriticalDamageBase", "value": 0.23}],
    [{"type": "CriticalDamageBase", "value": 0.26}],
    [{"type": "CriticalDamageBase", "value": 0.29}],
    [{"type": "CriticalDamageBase", "value": 0.32}]
  ]
};
const lcRank2 = {
  ...lcRank,
  desc: "When using Ultimate to attack the enemy target, the wearer receives the Disputation effect, which increases DMG dealt by #4[i]% and enables their follow-up attacks to ignore #5[i]% of the target's DEF. This effect lasts for #6[i] turns.",
};

const BaptismOfPureThought = (s: SuperImpositionLevel) => {
  const sValuesCd = [0.08, 0.09, 0.10, 0.11, 0.12]
  const sValuesDmg = [0.36, 0.42, 0.48, 0.54, 0.60]
  const sValuesFuaPen = [0.24, 0.28, 0.32, 0.36, 0.40]

  const content = [{
    lc: true,
    formItem: FormSliderWithPopover,
    id: 'debuffCdStacks',
    name: 'debuffCdStacks',
    text: 'Debuff cd stacks',
    title: lcRank.skill,
    content: getContentFromLCRanks(s, lcRank),
    min: 0,
    max: 3,
  }, {
    lc: true,
    formItem: FormSwitchWithPopover,
    id: 'postUltBuff',
    name: 'postUltBuff',
    text: 'Disputation ult cd / fua def pen buff',
    title: lcRank2.skill,
    content: getContentFromLCRanks(s, lcRank2),
  }]

  return {
    display: () => <DisplayFormControl content={content} />,
    defaults: () => ({
      debuffCdStacks: 3,
      postUltBuff: true,
    }),
    precomputeEffects: (x: PrecomputedCharacterConditional, request: Form) => {
      const r = request.lightConeConditionals as ConditionalLightConeMap;

      x[Stats.CD] += r.debuffCdStacks * sValuesCd[s]
      x.ELEMENTAL_DMG += r.postUltBuff ? sValuesDmg[s] : 0
      x.FUA_DEF_PEN += r.postUltBuff ? sValuesFuaPen[s] : 0
    },
    calculatePassives: (/*c, request */) => { },
    calculateBaseMultis: (/* c, request */) => { }
  }
};

export default BaptismOfPureThought;
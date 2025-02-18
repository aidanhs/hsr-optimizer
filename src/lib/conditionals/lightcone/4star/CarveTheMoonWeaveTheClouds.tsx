import React from "react";
import { Stats } from "lib/constants";
import DisplayFormControl from "components/optimizerForm/conditionals/DisplayFormControl";
import { FormSwitchWithPopover } from "components/optimizerForm/conditionals/FormSwitch";

import { SuperImpositionLevel } from "types/LightCone";
import { PrecomputedCharacterConditional } from "types/CharacterConditional";
import { Form } from 'types/Form';
import { LightConeConditional } from "types/LightConeConditionals";
import getContentFromLCRanks from "../getContentFromLCRank";


export default (s: SuperImpositionLevel): LightConeConditional => {
  const sValuesAtk = [0.10, 0.125, 0.15, 0.175, 0.20];
  const sValuesCd = [0.12, 0.15, 0.18, 0.21, 0.24];
  const lcRank = {
    "id": "21032",
    "skill": "Secret",
    "desc": `
      At the start of the battle and whenever the wearer's turn begins, one of the following effects is applied randomly:
      ::BR::
      All allies' ATK increases by #1[i]%
      ::BR::
      All allies' CRIT DMG increases by #2[i]%
      ::BR::
      All allies' Energy Regeneration Rate increases by #3[i]%.
      ::BR::
      The applied effect cannot be identical to the last effect applied, and will replace the previous effect. The applied effect will be removed when the wearer has been knocked down. Effects of the similar type cannot be stacked.`,
    "params": [[0.1, 0.12, 0.06], [0.125, 0.15, 0.075], [0.15, 0.18, 0.09], [0.175, 0.21, 0.105], [0.2, 0.24, 0.12]],
    "properties": [[], [], [], [], []]
  };

  const content = [{
    lc: true,
    id: 'atkBuffActive',
    name: 'atkBuffActive',
    formItem: FormSwitchWithPopover,
    text: 'Atk buff active',
    title: lcRank.skill,
    content: getContentFromLCRanks(s, lcRank),
  }, {
    lc: true,
    id: 'cdBuffActive',
    name: 'cdBuffActive',
    formItem: FormSwitchWithPopover,
    text: 'CD buff active',
    title: lcRank.skill,
    content: getContentFromLCRanks(s, lcRank),
  }];

  return {
    display: () => <DisplayFormControl content={content} />,
    defaults: () => ({
      atkBuffActive: true,
      cdBuffActive: false,
    }),
    precomputeEffects: (x: PrecomputedCharacterConditional, request: Form) => {
      const r = request.lightConeConditionals;

      x[Stats.ATK_P] += (r.atkBuffActive) ? sValuesAtk[s] : 0
      x[Stats.CD] += (r.cdBuffActive) ? sValuesCd[s] : 0
    },
    calculatePassives: (/*c, request */) => { },
    calculateBaseMultis: (/* c, request */) => { }
  }
}

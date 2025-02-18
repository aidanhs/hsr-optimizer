import React from "react";
import { Stats } from "lib/constants";
import { baseComputedStatsObject } from "lib/conditionals/constants";
import { basicRev, precisionRound, skillRev, talentRev, ultRev } from "lib/conditionals/utils";
import DisplayFormControl from "components/optimizerForm/conditionals/DisplayFormControl";
import { FormSwitchWithPopover } from "components/optimizerForm/conditionals/FormSwitch";

import { Eidolon } from "types/Character";
import { PrecomputedCharacterConditional } from "types/CharacterConditional";
import { Form } from 'types/Form';

const Serval = (e:Eidolon) => {
  const talentExtraDmgScaling = talentRev(e, 0.72, 0.792);

  const basicScaling = basicRev(e, 1.00, 1.10);
  const skillScaling = skillRev(e, 1.40, 1.54);
  const ultScaling = ultRev(e, 1.80, 1.944);
  const dotScaling = skillRev(e, 1.04, 1.144);

  const content = [{
    formItem: FormSwitchWithPopover,
    id: 'targetShocked',
    name: 'targetShocked',
    text: 'Target shocked',
    title: 'Target shocked',
    content: `After Serval attacks, deals Additional Lightning DMG equal to ${precisionRound(talentExtraDmgScaling * 100)}% of Serval's ATK to all Shocked enemies.`,
  }, {
    formItem: FormSwitchWithPopover,
    id: 'enemyDefeatedBuff',
    name: 'enemyDefeatedBuff',
    text: 'Enemy defeated buff',
    title: 'Enemy defeated buff',
    content: `Upon defeating an enemy, ATK increases by 20% for 2 turn(s).`,
  }];

  return {
    display: () => <DisplayFormControl content={content} />,
    defaults: () => ({
      targetShocked: true,
      enemyDefeatedBuff: true,
    }),
    precomputeEffects: (request: Form) => {
      const r = request.characterConditionals;
      const x = Object.assign({}, baseComputedStatsObject);

      // Stats
      x[Stats.ATK_P] += (r.enemyDefeatedBuff) ? 0.20 : 0;

      // Scaling;
      x.BASIC_SCALING += basicScaling;
      x.SKILL_SCALING += skillScaling;
      x.ULT_SCALING += ultScaling;
      x.DOT_SCALING += dotScaling;

      x.BASIC_SCALING += (r.targetShocked) ? talentExtraDmgScaling : 0;
      x.SKILL_SCALING += (r.targetShocked) ? talentExtraDmgScaling : 0;
      x.ULT_SCALING += (r.targetShocked) ? talentExtraDmgScaling : 0;

      // Boost
      x.ELEMENTAL_DMG += (e >= 6 && r.targetShocked) ? 0.30 : 0;

      return x
    },
    calculateBaseMultis: (c: PrecomputedCharacterConditional) => {
      const x = c['x'];

      x.BASIC_DMG += x.BASIC_SCALING * x[Stats.ATK];
      x.SKILL_DMG += x.SKILL_SCALING * x[Stats.ATK];
      x.ULT_DMG += x.ULT_SCALING * x[Stats.ATK];
      x.DOT_DMG += x.DOT_SCALING * x[Stats.ATK];
    }
  }
};
export default Serval;
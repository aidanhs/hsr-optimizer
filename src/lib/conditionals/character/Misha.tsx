import React from 'react';
import { Stats } from 'lib/constants';
import { baseComputedStatsObject } from 'lib/conditionals/constants';
import { basicRev, precisionRound, skillRev, ultRev } from 'lib/conditionals/utils';

import DisplayFormControl from 'components/optimizerForm/conditionals/DisplayFormControl';
import { FormSwitchWithPopover } from 'components/optimizerForm/conditionals/FormSwitch';
import { FormSliderWithPopover } from 'components/optimizerForm/conditionals/FormSlider';

import { Eidolon } from 'types/Character'
import { PrecomputedCharacterConditional } from 'types/CharacterConditional';
import { Form } from 'types/Form';

export default (e: Eidolon) => {
  const basicScaling = basicRev(e, 1.00, 1.10);
  const skillScaling = skillRev(e, 2.00, 2.20);
  let ultStackScaling = ultRev(e, 0.60, 0.65);
  ultStackScaling += (e >= 4 ? 0.06 : 0);

  const content = [{
    formItem: FormSliderWithPopover,
    id: 'ultHitsOnTarget',
    name: 'ultHitsOnTarget',
    text: 'Ult hits on target',
    title: 'Ult hits on target',
    content: `Number of Ultimate hits on the primary target, dealing DMG equal to ${precisionRound(ultStackScaling * 100)}% ATK per hit.`,
    min: 1,
    max: 10,
  }, {
    formItem: FormSwitchWithPopover,
    id: 'enemyFrozen',
    name: 'enemyFrozen',
    text: 'Enemy frozen',
    title: 'Enemy frozen',
    content: `When dealing DMG to Frozen enemies, increases CRIT DMG by 30%.`,
  }, {
    formItem: FormSwitchWithPopover,
    id: 'e2DefReduction',
    name: 'e2DefReduction',
    text: 'E2 DEF reduction',
    title: 'E2 DEF reduction',
    content: `E2: Reduces the target's DEF by 16% for 3 turn(s).`,
    disabled: e < 2,
  }, {
    formItem: FormSwitchWithPopover,
    id: 'e6UltDmgBoost',
    name: 'e6UltDmgBoost',
    text: 'E6 ult DMG boost',
    title: 'E6 ult DMG boost',
    content: `E6: When using the Ultimate, increases own DMG by 30%, lasting until the end of the turn.`,
    disabled: e < 6,
  }];

  return {
    display: () => <DisplayFormControl content={content} />,
    defaults: () => ({
      ultHitsOnTarget: 10,
      enemyFrozen: true,
      e2DefReduction: true,
      e6UltDmgBoost: true,
    }),
    precomputeEffects: (request: Form) => {
      const r = request.characterConditionals
      const x = Object.assign({}, baseComputedStatsObject);

      x[Stats.CD] += (r.enemyFrozen) ? 0.30 : 0

      x.DEF_SHRED += (e >= 2 && r.e2DefReduction) ? 0.16 : 0
      x.ELEMENTAL_DMG += (e >= 6 && r.e6UltDmgBoost) ? 0.30 : 0

      x.BASIC_SCALING += basicScaling
      x.SKILL_SCALING += skillScaling
      x.ULT_SCALING += ultStackScaling * (r.ultHitsOnTarget);

      return x
    },
    calculateBaseMultis: (c: PrecomputedCharacterConditional) => {
      const x = c['x'];

      x.BASIC_DMG += x.BASIC_SCALING * x[Stats.ATK]
      x.SKILL_DMG += x.SKILL_SCALING * x[Stats.ATK]
      x.ULT_DMG += x.ULT_SCALING * x[Stats.ATK]
    }
  }
}



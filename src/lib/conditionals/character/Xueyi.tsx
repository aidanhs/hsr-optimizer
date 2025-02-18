import React from 'react';
import { Stats } from 'lib/constants';
import { basic, calculateAshblazingSet, precisionRound, skill, talent, ult } from "lib/conditionals/utils";
import { ASHBLAZING_ATK_STACK, baseComputedStatsObject, ComputedStatsObject } from 'lib/conditionals/constants';
import { FormSliderWithPopover } from 'components/optimizerForm/conditionals/FormSlider';
import { FormSwitchWithPopover } from 'components/optimizerForm/conditionals/FormSwitch';
import { ConditionalMap } from 'types/Conditionals';
import { CharacterConditional } from 'types/CharacterConditional';
import { ContentItem } from 'types/Conditionals';
import { Form } from 'types/Form';
import DisplayFormControl from 'components/optimizerForm/conditionals/DisplayFormControl';
import { Eidolon } from 'types/Character';
import { Unknown } from 'types/Common';


const Xueyi = (e: Eidolon): CharacterConditional => {
  const ultBoostMax = ult(e, 0.60, 0.648)
  const basicScaling = basic(e, 1.00, 1.10)
  const skillScaling = skill(e, 1.40, 1.54)
  const ultScaling = ult(e, 2.50, 2.70)
  const fuaScaling = talent(e, 0.90, 0.99)

  const hitMultiByFuaHits = {
    0: 0,
    1: ASHBLAZING_ATK_STACK * (1 * 1 / 1), // 0.06
    2: ASHBLAZING_ATK_STACK * (1 * 1 / 2 + 2 * 1 / 2), // 0.09
    3: ASHBLAZING_ATK_STACK * (1 * 1 / 3 + 2 * 1 / 3 + 3 * 1 / 3) // 0.12
  };

  const content: ContentItem[] = [
    {
      id: 'enemyToughness50',
      text: 'Intrepid Rollerbearings',
      formItem: FormSwitchWithPopover,
      title: 'Intrepid Rollerbearings',
      content: "If the enemy target's Toughness is equal to or higher than 50% of their Max Toughness, deals 10% more DMG when using Ultimate.",
    },
    {
      id: 'toughnessReductionDmgBoost',
      text: 'Ultimate DMG boost',
      formItem: FormSliderWithPopover,
      title: 'Ultimate: Divine Castigation',
      content: `When using Ultimate, the more Toughness is reduced, the higher the DMG will be dealt, up to a max of ${precisionRound(ultBoostMax * 100)}% increase.`,
      min: 0,
      max: ultBoostMax,
      percent: true,
    },
    {
      id: 'fuaHits',
      text: 'FUA hits',
      formItem: FormSliderWithPopover,
      title: 'Talent: Karmic Perpetuation',
      content: `When Karma reaches the max number of stacks, consumes all current Karma stacks and immediately launches a follow-up attack against an enemy target, 
      dealing DMG for 3 times, with each time dealing Quantum DMG equal to ${precisionRound(fuaScaling * 100)}% of Xueyi's ATK to a single random enemy.`,
      min: 0,
      max: 3,
    },
    {
      id: 'e4BeBuff',
      text: 'E4: Karma, Severed',
      formItem: FormSwitchWithPopover,
      title: 'E4 break effect buff',
      content: "E4: When using Ultimate, increases Break Effect by 40% for 2 turn(s).",
      disabled: (e < 4),
    }
  ];

  return {
    display: () => <DisplayFormControl ultBoostMax={ultBoostMax} eidolon={e} content={content} />,
    defaults: () => ({
      enemyToughness50: true,
      toughnessReductionDmgBoost: ultBoostMax,
      fuaHits: 3,
      e4BeBuff: true,
    }),
    precomputeEffects: (request: Form) => {
      const r: ConditionalMap = request.characterConditionals
      const x = Object.assign({}, baseComputedStatsObject)

      // Stats
      x[Stats.BE] += (e >= 4 && r.e4BeBuff) ? 0.40 : 0

      // Scaling
      x.BASIC_SCALING += basicScaling
      x.SKILL_SCALING += skillScaling
      x.ULT_SCALING += ultScaling
      x.FUA_SCALING += fuaScaling * (r.fuaHits as number);

      // Boost
      x.ULT_BOOST += (r.enemyToughness50) ? 0.10 : 0
      x.ULT_BOOST += r.toughnessReductionDmgBoost as number;
      x.FUA_BOOST += (e >= 1) ? 0.40 : 0

      return x;
    },
    calculateBaseMultis: (c: Unknown, request: Form) => {
      const r = request.characterConditionals as { [key: string]: number }
      const x: ComputedStatsObject = c['x'];

      x.ELEMENTAL_DMG += Math.min(2.40, x[Stats.BE])

      x.BASIC_DMG += x.BASIC_SCALING * x[Stats.ATK]
      x.SKILL_DMG += x.SKILL_SCALING * x[Stats.ATK]
      x.ULT_DMG += x.ULT_SCALING * x[Stats.ATK]

      const hitMulti = hitMultiByFuaHits[r.fuaHits]
      const { ashblazingMulti, ashblazingAtk } = calculateAshblazingSet(c, request, hitMulti)
      x.FUA_DMG += x.FUA_SCALING * (x[Stats.ATK] - ashblazingAtk + ashblazingMulti)
    }
  }
}

export default Xueyi;
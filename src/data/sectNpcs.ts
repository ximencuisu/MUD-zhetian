import { NpcRank } from './sectSkills';

export interface SectNpcDef {
  id: string;
  name: string;
  rank: NpcRank;
  description: string;
  sect: string;
  dialogue: string[];
}

// 摇光圣地 NPC
export const YAOGUAN_NPCS: SectNpcDef[] = [
  { id: 'yg_zayi', name: '摇光杂役·王二', rank: '杂役弟子', description: '摇光圣地的杂役弟子，负责打扫庭院。', sect: 'yaoguan', dialogue: ['杂役弟子也要努力修炼啊！', '听说内门师兄又突破了！'] },
  { id: 'yg_waimen1', name: '摇光外门·李风', rank: '外门弟子', description: '摇光圣地外门弟子，修炼古皇拳基础。', sect: 'yaoguan', dialogue: ['古皇拳博大精深，我才刚入门。', '想学更多？去找内门师兄请教吧。'] },
  { id: 'yg_waimen2', name: '摇光外门·赵灵', rank: '外门弟子', description: '摇光圣地外门女弟子，天赋不错。', sect: 'yaoguan', dialogue: ['圣地的修炼资源真是无穷无尽。', '外门的功法已经不够用了。'] },
  { id: 'wg_neimen1', name: '摇光内门·孙烈', rank: '内门弟子', description: '摇光圣地内门弟子，古皇拳已有所成。', sect: 'yaoguan', dialogue: ['古皇拳经，拳出如皇者降临！', '内门的功法比外门强了不知多少倍。'] },
  { id: 'wg_neimen2', name: '摇光内门·周青', rank: '内门弟子', description: '摇光圣地内门弟子，圣光神通初窥门径。', sect: 'yaoguan', dialogue: ['圣光神通，攻防兼备。', '真传师兄的功法才叫厉害。'] },
  { id: 'wg_zhenchuan', name: '摇光真传·楚狂', rank: '真传弟子', description: '摇光圣地真传弟子，古皇拳大成。', sect: 'yaoguan', dialogue: ['古皇拳大成，可憾天地！', '外门长老那里有宗门正法，去请教吧。'] },
  { id: 'wg_wailao1', name: '摇光外门长老·莫长老', rank: '外门长老', description: '摇光圣地外门长老，负责教导外门和真传弟子。', sect: 'yaoguan', dialogue: ['宗门正法，唯有天赋异禀者方可习之。', '内门长老那里有王侯秘传。'] },
  { id: 'wg_neilao1', name: '摇光内门长老·玄长老', rank: '内门长老', description: '摇光圣地内门长老，修为深厚。', sect: 'yaoguan', dialogue: ['王侯秘传，非同小可。', '道子和圣女那里有圣贤古诀。'] },
  { id: 'wg_daozi', name: '摇光道子·姬长空', rank: '道子', description: '摇光圣地唯一道子，天赋绝世，圣光圣体。', sect: 'yaoguan', dialogue: ['道子之位，唯我独尊。', '圣贤古诀，我已尽数领悟。'] },
  { id: 'wg_shengnv', name: '摇光圣女·月婵', rank: '圣女', description: '摇光圣地唯一圣女，倾国倾城，圣光神体。', sect: 'yaoguan', dialogue: ['圣光之下，万法皆明。', '宗主那里有镇教秘术。'] },
  { id: 'wg_taishang', name: '摇光太上长老·古皇', rank: '太上长老', description: '摇光圣地太上长老，活了不知多少岁月的老怪物。', sect: 'yaoguan', dialogue: ['老夫当年也曾纵横东荒。', '镇教秘术，唯有宗主可传。'] },
  { id: 'wg_zongzhu', name: '摇光圣主·摇光', rank: '宗主', description: '摇光圣地圣主，东荒南域第一人。', sect: 'yaoguan', dialogue: ['镇教秘术，乃圣地根基。', '极道帝经……传说在圣地最深处。'] },
];

// 姬家 NPC
export const JI_FAMILY_NPCS: SectNpcDef[] = [
  { id: 'ji_zayi', name: '姬家杂役·福伯', rank: '杂役弟子', description: '姬家祖地的杂役。', sect: 'ji_family', dialogue: ['虚空镜的传说，老夫听过无数次了。'] },
  { id: 'ji_waimen1', name: '姬家外门·姬明', rank: '外门弟子', description: '姬家外门弟子。', sect: 'ji_family', dialogue: ['虚空经博大精深。'] },
  { id: 'ji_waimen2', name: '姬家外门·姬雪', rank: '外门弟子', description: '姬家外门女弟子。', sect: 'ji_family', dialogue: ['虚空步法，虚实难辨。'] },
  { id: 'ji_neimen1', name: '姬家内门·姬云', rank: '内门弟子', description: '姬家内门弟子。', sect: 'ji_family', dialogue: ['虚空之力，可破万法。'] },
  { id: 'ji_neimen2', name: '姬家内门·姬风', rank: '内门弟子', description: '姬家内门弟子。', sect: 'ji_family', dialogue: ['内门功法已不够用了。'] },
  { id: 'ji_zhenchuan', name: '姬家真传·姬无道', rank: '真传弟子', description: '姬家真传弟子，虚空经大成。', sect: 'ji_family', dialogue: ['虚空经大成，可纵横天下。'] },
  { id: 'ji_wailao', name: '姬家外门长老·姬玄', rank: '外门长老', description: '姬家外门长老。', sect: 'ji_family', dialogue: ['宗门正法，唯有天赋者习之。'] },
  { id: 'ji_neilao', name: '姬家内门长老·姬长空', rank: '内门长老', description: '姬家内门长老。', sect: 'ji_family', dialogue: ['王侯秘传，非同小可。'] },
  { id: 'ji_daozi', name: '姬家道子·姬昊', rank: '道子', description: '姬家唯一道子，虚空圣体。', sect: 'ji_family', dialogue: ['虚空道子，唯我独尊。'] },
  { id: 'ji_shengnv', name: '姬家圣女·姬月', rank: '圣女', description: '姬家唯一圣女。', sect: 'ji_family', dialogue: ['虚空镜照，万法皆明。'] },
  { id: 'ji_taishang', name: '姬家太上长老·姬古', rank: '太上长老', description: '姬家太上长老。', sect: 'ji_family', dialogue: ['老夫当年也曾手持虚空镜。'] },
  { id: 'ji_zongzhu', name: '姬家家主·姬长空', rank: '宗主', description: '姬家家主，龙华圣子。', sect: 'ji_family', dialogue: ['虚空经……传说在祖地最深处。'] },
];

// 太玄门 NPC
export const TAIXUAN_NPCS: SectNpcDef[] = [
  { id: 'tx_zayi', name: '太玄杂役·段德', rank: '杂役弟子', description: '太玄门杂役弟子，据说曾经盗取过行字秘。', sect: 'taixuan', dialogue: ['嘿嘿，行字秘的残篇我可是见过的！'] },
  { id: 'tx_waimen1', name: '太玄外门·李速', rank: '外门弟子', description: '太玄门外门弟子。', sect: 'taixuan', dialogue: ['太玄门的速度，天下无双！'] },
  { id: 'tx_waimen2', name: '太玄外门·王快', rank: '外门弟子', description: '太玄门外门弟子。', sect: 'taixuan', dialogue: ['我的速度已经比闪电还快了！'] },
  { id: 'tx_neimen1', name: '太玄内门·赵飞', rank: '内门弟子', description: '太玄门内门弟子。', sect: 'taixuan', dialogue: ['行字秘，速度之道的极致！'] },
  { id: 'tx_neimen2', name: '太玄内门·孙行', rank: '内门弟子', description: '太玄门内门弟子。', sect: 'taixuan', dialogue: ['内门的行字秘比外门强多了。'] },
  { id: 'tx_zhenchuan', name: '太玄真传·风无痕', rank: '真传弟子', description: '太玄门真传弟子，行字秘大成。', sect: 'taixuan', dialogue: ['行字秘大成，可超越光速！'] },
  { id: 'tx_wailao', name: '太玄外门长老·风长老', rank: '外门长老', description: '太玄门外门长老。', sect: 'taixuan', dialogue: ['宗门正法，唯有速度天赋者习之。'] },
  { id: 'tx_neilao', name: '太玄内门长老·雷长老', rank: '内门长老', description: '太玄门内门长老。', sect: 'taixuan', dialogue: ['王侯秘传，行字秘进阶。'] },
  { id: 'tx_daozi', name: '太玄道子·风行', rank: '道子', description: '太玄门唯一道子，行字圣体。', sect: 'taixuan', dialogue: ['行字道子，速度天下无双！'] },
  { id: 'tx_shengnv', name: '太玄圣女·云影', rank: '圣女', description: '太玄门唯一圣女。', sect: 'taixuan', dialogue: ['行字圣女，来去如风。'] },
  { id: 'tx_taishang', name: '太玄太上长老·古行', rank: '太上长老', description: '太玄门太上长老。', sect: 'taixuan', dialogue: ['老夫当年也曾追过段德。'] },
  { id: 'tx_zongzhu', name: '太玄掌门·太玄', rank: '宗主', description: '太玄门掌门。', sect: 'taixuan', dialogue: ['行字秘完整版……传说在太玄山最深处。'] },
];

// 紫府圣地 NPC
export const ZIFU_NPCS: SectNpcDef[] = [
  { id: 'zf_zayi', name: '紫府杂役·小紫', rank: '杂役弟子', description: '紫府圣地杂役弟子。', sect: 'zifu', dialogue: ['紫府的紫色源力真好看！'] },
  { id: 'zf_waimen1', name: '紫府外门·紫风', rank: '外门弟子', description: '紫府圣地外门弟子。', sect: 'zifu', dialogue: ['紫色源力，攻防兼备。'] },
  { id: 'zf_waimen2', name: '紫府外门·紫光', rank: '外门弟子', description: '紫府圣地外门弟子。', sect: 'zifu', dialogue: ['紫府大阵，攻防一体。'] },
  { id: 'zf_neimen1', name: '紫府内门·紫云', rank: '内门弟子', description: '紫府圣地内门弟子。', sect: 'zifu', dialogue: ['紫府内门功法，攻防兼备。'] },
  { id: 'zf_neimen2', name: '紫府内门·紫雷', rank: '内门弟子', description: '紫府圣地内门弟子。', sect: 'zifu', dialogue: ['紫色神罡，坚不可摧。'] },
  { id: 'zf_zhenchuan', name: '紫府真传·紫极', rank: '真传弟子', description: '紫府圣地真传弟子。', sect: 'zifu', dialogue: ['紫极之境，攻防大成！'] },
  { id: 'zf_wailao', name: '紫府外门长老·紫玄', rank: '外门长老', description: '紫府圣地外门长老。', sect: 'zifu', dialogue: ['宗门正法，唯有天赋者习之。'] },
  { id: 'zf_neilao', name: '紫府内门长老·紫古', rank: '内门长老', description: '紫府圣地内门长老。', sect: 'zifu', dialogue: ['王侯秘传，非同小可。'] },
  { id: 'zf_daozi', name: '紫府道子·紫天', rank: '道子', description: '紫府圣地唯一道子。', sect: 'zifu', dialogue: ['紫天道子，攻防无双！'] },
  { id: 'zf_shengnv', name: '紫府圣女·紫月', rank: '圣女', description: '紫府圣地唯一圣女。', sect: 'zifu', dialogue: ['紫月圣女，紫色源力。'] },
  { id: 'zf_taishang', name: '紫府太上长老·紫皇', rank: '太上长老', description: '紫府圣地太上长老。', sect: 'zifu', dialogue: ['老夫当年也曾纵横中州。'] },
  { id: 'zf_zongzhu', name: '紫府圣主·紫府', rank: '宗主', description: '紫府圣地圣主。', sect: 'zifu', dialogue: ['紫府帝经……传说在紫府山最深处。'] },
];

// 姜家 NPC
export const JIANG_NPCS: SectNpcDef[] = [
  { id: 'jg_zayi', name: '姜家杂役·姜福', rank: '杂役弟子', description: '姜家杂役。', sect: 'jiang_family', dialogue: ['姜家的柔劲，以弱胜强。'] },
  { id: 'jg_waimen1', name: '姜家外门·姜明', rank: '外门弟子', description: '姜家外门弟子。', sect: 'jiang_family', dialogue: ['以柔克刚，姜家之道。'] },
  { id: 'jg_waimen2', name: '姜家外门·姜柔', rank: '外门弟子', description: '姜家外门女弟子。', sect: 'jiang_family', dialogue: ['柔能克刚，弱能胜强。'] },
  { id: 'jg_neimen1', name: '姜家内门·姜云', rank: '内门弟子', description: '姜家内门弟子。', sect: 'jiang_family', dialogue: ['姜家内门功法，以柔克刚。'] },
  { id: 'jg_neimen2', name: '姜家内门·姜风', rank: '内门弟子', description: '姜家内门弟子。', sect: 'jiang_family', dialogue: ['源术之道，姜家独有。'] },
  { id: 'jg_zhenchuan', name: '姜家真传·姜无道', rank: '真传弟子', description: '姜家真传弟子。', sect: 'jiang_family', dialogue: ['以弱胜强，姜家真传！'] },
  { id: 'jg_wailao', name: '姜家外门长老·姜玄', rank: '外门长老', description: '姜家外门长老。', sect: 'jiang_family', dialogue: ['宗门正法，唯有天赋者习之。'] },
  { id: 'jg_neilao', name: '姜家内门长老·姜古', rank: '内门长老', description: '姜家内门长老。', sect: 'jiang_family', dialogue: ['王侯秘传，非同小可。'] },
  { id: 'jg_daozi', name: '姜家道子·姜天', rank: '道子', description: '姜家唯一道子。', sect: 'jiang_family', dialogue: ['姜天道子，以柔克刚！'] },
  { id: 'jg_shengnv', name: '姜家圣女·姜月', rank: '圣女', description: '姜家唯一圣女。', sect: 'jiang_family', dialogue: ['姜月圣女，柔能克刚。'] },
  { id: 'jg_taishang', name: '姜家太上长老·姜皇', rank: '太上长老', description: '姜家太上长老。', sect: 'jiang_family', dialogue: ['老夫当年也曾以弱胜强。'] },
  { id: 'jg_zongzhu', name: '姜家家主·姜帝', rank: '宗主', description: '姜家家主。', sect: 'jiang_family', dialogue: ['姜家帝诀……传说在祖地最深处。'] },
];

// 妖族 NPC
export const YAO_NPCS: SectNpcDef[] = [
  { id: 'yao_zayi', name: '妖族杂役·小妖', rank: '杂役弟子', description: '妖族杂役。', sect: 'yao_clan', dialogue: ['青莲圣火，焚烧万物！'] },
  { id: 'yao_waimen1', name: '妖族外门·妖风', rank: '外门弟子', description: '妖族外门弟子。', sect: 'yao_clan', dialogue: ['妖族天生神通，何等强大！'] },
  { id: 'yao_waimen2', name: '妖族外门·妖月', rank: '外门弟子', description: '妖族外门女弟子。', sect: 'yao_clan', dialogue: ['青莲圣火，生生不息。'] },
  { id: 'yao_neimen1', name: '妖族内门·妖云', rank: '内门弟子', description: '妖族内门弟子。', sect: 'yao_clan', dialogue: ['妖族内门功法，天生神通。'] },
  { id: 'yao_neimen2', name: '妖族内门·妖雷', rank: '内门弟子', description: '妖族内门弟子。', sect: 'yao_clan', dialogue: ['妖血淬体，肉身成圣。'] },
  { id: 'yao_zhenchuan', name: '妖族真传·妖极', rank: '真传弟子', description: '妖族真传弟子。', sect: 'yao_clan', dialogue: ['妖极之境，天生神通大成！'] },
  { id: 'yao_wailao', name: '妖族外门长老·妖玄', rank: '外门长老', description: '妖族外门长老。', sect: 'yao_clan', dialogue: ['宗门正法，唯有天赋者习之。'] },
  { id: 'yao_neilao', name: '妖族内门长老·妖古', rank: '内门长老', description: '妖族内门长老。', sect: 'yao_clan', dialogue: ['王侯秘传，非同小可。'] },
  { id: 'yao_daozi', name: '妖族道子·妖天', rank: '道子', description: '妖族唯一道子。', sect: 'yao_clan', dialogue: ['妖天道子，天生神通！'] },
  { id: 'yao_shengnv', name: '妖族圣女·颜如玉', rank: '圣女', description: '妖族唯一圣女，青帝后裔，倾国倾城。', sect: 'yao_clan', dialogue: ['青莲圣火，生生不息。'] },
  { id: 'yao_taishang', name: '妖族太上长老·妖皇', rank: '太上长老', description: '妖族太上长老。', sect: 'yao_clan', dialogue: ['老夫当年也曾追随青帝。'] },
  { id: 'yao_zongzhu', name: '妖族圣主·青帝', rank: '宗主', description: '妖族圣主，青帝后裔。', sect: 'yao_clan', dialogue: ['青帝经……传说在圣山最深处。'] },
];

import { ALL_FUNCTION_NPCS } from './sectFunctionNpcs';

export const ALL_SECT_NPCS: SectNpcDef[] = [
  ...YAOGUAN_NPCS, ...JI_FAMILY_NPCS, ...TAIXUAN_NPCS,
  ...ZIFU_NPCS, ...JIANG_NPCS, ...YAO_NPCS,
  ...ALL_FUNCTION_NPCS,
];

// Flat record for O(1) lookup by id
export const SECT_NPC_MAP: Record<string, SectNpcDef> = Object.fromEntries(
  ALL_SECT_NPCS.map(n => [n.id, n])
);

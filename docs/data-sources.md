# Data sources

**P** = priority (1 = needed for the first model, 2 = weeks 3–5, 3 = nice to have).
**Status:** ⬜ not started · 🟡 in progress · ✅ loaded · ⚠️ problem (see notes).
Rows marked *(check)* have access terms or coverage we still need to confirm.

## 1. Election history and voting behaviour
| P | Factor | Source | Level | Updates | Status |
|---|---|---|---|---|---|
| 1 | Presidential results 2011–2023 | INEC; Stears/Dataphyte digitisations | State, LGA (2023: polling unit) | Fixed | ⬜ |
| 1 | Governorship & NASS results | INEC | State, LGA | Fixed | ⬜ |
| 1 | Off-cycle results: Edo, Ondo (2024), Anambra (2025), Ekiti, Osun (2026) | INEC | LGA, PU | Fixed | ⬜ |
| 2 | By-elections 2024–26 | INEC, news | Constituency | As held | ⬜ |
| 2 | Local government elections | State electoral commissions | LGA, ward | As held | ⬜ |
| 1 | Turnout history | INEC | LGA, PU | Fixed | ⬜ |
| 2 | Cancelled/voided votes, over-voting | INEC, tribunal records | PU | Fixed | ⬜ |
| 2 | 2023 tribunal & Supreme Court rulings | Judgments | State | Fixed | ⬜ |

## 2. Voter register and mobilisation
| P | Factor | Source | Level | Updates | Status |
|---|---|---|---|---|---|
| 1 | Registered voters | INEC | State, LGA, PU | Per cycle | ⬜ |
| 1 | New registrations 2025–26 by age, gender, occupation | INEC registration updates | State | Weekly during registration | ⬜ |
| 1 | PVC collection rate | INEC | State | Periodic | ⬜ |
| 2 | Polling unit locations | INEC unit locator, GRID3 | PU | Fixed | ⬜ |

## 3. Party structure and the political class
| P | Factor | Source | Level | Updates | Status |
|---|---|---|---|---|---|
| 1 | Governor's party | INEC, news | State | As it changes | ⬜ |
| 1 | Senators, reps, state assembly by party | NASS, state assemblies, news | Constituency | As it changes | ⬜ |
| 2 | LGA chairmen by party | State electoral commissions, news | LGA | As it changes | ⬜ |
| 1 | Defections tracker (all levels) | News pipeline | Every level | Daily | ⬜ |
| 2 | Primary disputes, aggrieved aspirants | News, court filings | State, constituency | Daily | ⬜ |
| 2 | Candidate visits and rally locations | News, campaign announcements | State, city | Daily | ⬜ |
| 2 | Godfather / power-broker alignments | News, analyst input | State | Ad hoc | ⬜ |

## 4. Candidate factors
| P | Factor | Source | Level | Updates | Status |
|---|---|---|---|---|---|
| 1 | Home state, region, ethnicity, religion of candidates and running mates | INEC candidate list, bios | National | Fixed | ⬜ |
| 1 | North–South zoning sentiment | Analyst input, news | Zone | Ad hoc | ⬜ |
| 3 | Age, health, controversies | News | National | Ad hoc | ⬜ |

## 5. Cost of living and the economy
| P | Factor | Source | Level | Updates | Status |
|---|---|---|---|---|---|
| 1 | Headline & food inflation | NBS CPI | State | Monthly | ⬜ |
| 1 | Food prices (rice, garri, beans, yam, bread…) | NBS Selected Food Prices Watch | State | Monthly | ⬜ |
| 1 | Petrol, diesel, cooking gas, kerosene | NBS fuel price watch | State | Monthly | ⬜ |
| 2 | Transport fares | NBS Transport Fare Watch | State | Monthly | ⬜ |
| 2 | Market prices | WFP market prices, FEWS NET | Market town | Monthly | ⬜ |
| 2 | Exchange rate (official vs parallel) | CBN, parallel-market trackers | National | Daily | ⬜ |
| 2 | Unemployment, underemployment | NBS labour force survey | State | Quarterly | ⬜ |
| 2 | Electricity tariff and supply hours | NERC, DisCo reports | DisCo, state | Monthly | ⬜ |
| 2 | Unpaid salaries and pensions | News, union statements | State | Ad hoc | ⬜ |
| 2 | Federal allocations (FAAC) | Finance ministry / OAGF | State | Monthly | ⬜ |
| 3 | State finances | BudgIT State of States | State | Yearly | ⬜ |
| 3 | Cash transfers, student loans | Programme reports *(check detail)* | State | Periodic | ⬜ |

## 6. Poverty, wealth and hunger
| P | Factor | Source | Level | Updates | Status |
|---|---|---|---|---|---|
| 1 | Relative wealth | Meta Relative Wealth Index (HDX) | ~2 km grid | Fixed | ⬜ |
| 2 | Night-time lights | VIIRS | ~500 m grid | Monthly | ⬜ |
| 2 | Multidimensional poverty | NBS MPI 2022 | State | Fixed | ⬜ |
| 1 | Food insecurity | Cadre Harmonisé | LGA | Twice a year | ⬜ |

## 7. Population, ethnicity, religion and culture
| P | Factor | Source | Level | Updates | Status |
|---|---|---|---|---|---|
| 1 | Population estimates | WorldPop, NPC projections | 100 m grid, ward | Yearly | ⬜ |
| 1 | Settlements and ward boundaries | GRID3 Nigeria | Ward, settlement | Fixed | ⬜ |
| 1 | Ethnic and religious make-up (aggregate only) | NDHS 2023–24, Afrobarometer | State, zone | Fixed | ⬜ |
| 2 | Ethnic homeland maps | GeoEPR, GREG | Polygon → LGA | Fixed | ⬜ |
| 2 | Settler populations | NDHS migration, past results | State, LGA | Fixed | ⬜ |
| 2 | Age structure | INEC register, NDHS | State | Fixed | ⬜ |
| 2 | Urban vs rural | GRID3, WorldPop | LGA, ward | Fixed | ⬜ |
| 2 | Displaced people | IOM DTM | LGA, camp | Monthly | ⬜ |

## 8. Education and media exposure
| P | Factor | Source | Level | Updates | Status |
|---|---|---|---|---|---|
| 1 | Education and literacy | NDHS 2023–24 | State | Fixed | ⬜ |
| 2 | WAEC/NECO pass rates, out-of-school children | WAEC, UNICEF, UBEC | State | Yearly | ⬜ |
| 2 | Radio, TV, phone, internet use | NDHS media exposure | State | Fixed | ⬜ |

## 9. Security and stability
| P | Factor | Source | Level | Updates | Status |
|---|---|---|---|---|---|
| 1 | Violent events | ACLED *(check terms)* | LGA | Weekly | ⬜ |
| 2 | Violence statistics (second source) | Nigeria Watch | LGA | Ongoing | ⬜ |
| 1 | SE sit-at-home orders | ACLED, news | State, LGA | Ad hoc | ⬜ |
| 2 | Election violence history (2019, 2023) | Situation Room, CDD, Yiaga | LGA | Fixed | ⬜ |
| 2 | Farmer–herder conflict | ACLED, news | LGA | Weekly | ⬜ |

## 10. Influencers and institutions
| P | Factor | Source | Level | Updates | Status |
|---|---|---|---|---|---|
| 1 | Traditional rulers' signals | News pipeline | State, emirate | Ad hoc | ⬜ |
| 1 | Religious bodies (CAN, JNI, Pentecostal leaders, Izala, Tijjaniyya) | News pipeline | Zone, national | Ad hoc | ⬜ |
| 1 | Ethnic/regional groups (Ohanaeze, Afenifere, ACF, PANDEF, Middle Belt Forum) | News pipeline | Zone | Ad hoc | ⬜ |
| 2 | Unions (NLC, TUC, ASUU, NANS, NURTW) | News pipeline | National, state | Ad hoc | ⬜ |
| 2 | Political movements | News, social | State | Ad hoc | ⬜ |
| 3 | Celebrity and influencer endorsements | News, social | National | Ad hoc | ⬜ |

## 11. Media, online and campaign signals
| P | Factor | Source | Level | Updates | Status |
|---|---|---|---|---|---|
| 1 | News volume and tone by place | GDELT | State, some cities | 15 min | ⬜ |
| 1 | Nigerian news | RSS: Premium Times, Punch, Vanguard, Daily Trust, TheCable, Channels, Guardian, Leadership, Sahara Reporters, BBC Hausa/Pidgin | National, state | Minutes | ⬜ |
| 1 | Political ad spending | Meta Ad Library API *(check Nigeria coverage)* | State | Daily | ⬜ |
| 2 | Search interest | Google Trends (NG by state) | State | Daily | ⬜ |
| 2 | Nairaland politics section | Scrape *(check terms)* | National | Daily | ⬜ |
| 2 | YouTube views/comments | YouTube Data API | National | Daily | ⬜ |
| 3 | Wikipedia pageviews | Wikimedia API | National | Daily | ⬜ |
| 2 | Misinformation trends | Dubawa, FactCheckHub, Africa Check | National | Weekly | ⬜ |
| 3 | X (Twitter) | Paid API: skipped | – | – | ⬜ |

## 12. Polls, observers and markets
| P | Factor | Source | Level | Updates | Status |
|---|---|---|---|---|---|
| 1 | Published polls | NOI Polls, Anap, Stears, Bloomberg/Premise, others | National, some states | As published | ⬜ |
| 2 | Attitudes survey | Afrobarometer (latest Nigeria round) | State, zone | Each round | ⬜ |
| 2 | Pre-election observer reports | Yiaga, CDD, Situation Room, SBM Intelligence | State, LGA | Periodic | ⬜ |
| 2 | Vote-buying history | Observer reports | State, LGA | Fixed | ⬜ |
| 3 | Prediction markets / betting odds | Polymarket and others *(check listing)* | National | Live | ⬜ |

## 13. Election-day logistics
| P | Factor | Source | Level | Updates | Status |
|---|---|---|---|---|---|
| 2 | Past late arrivals / logistics failures | Observer reports, EU EOM 2023 | LGA | Fixed | ⬜ |
| 2 | INEC readiness (BVAS, staffing) | INEC, news | State | Weekly | ⬜ |
| 1 | IReV live polling-unit results (election day) | INEC IReV | PU | Minutes | ⬜ |

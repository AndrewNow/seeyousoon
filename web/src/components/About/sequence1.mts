import { textContainerBio } from "./About.astro.0.mts";

export let sequence1 = [
// [
//   sys,
//   {
//     opacity: 1,
//   },
// ],
[
textContainerBio,
{
transform: `translateY(0)`,
opacity: 1,
filter: `blur(0)`,
},
{
at: "+3.0",
},
],
];

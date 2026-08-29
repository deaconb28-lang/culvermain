# About this folder

`README.md` here is the design handoff — the specification this site was built
from. `screenshots/` is what it is meant to look like.

The handoff also shipped `design/*.dc.html` plus a `support.js` runtime. Those
are a proprietary streaming component format from the design tool; they do not
run outside it and are not shippable code. They are deliberately **not** in this
repository — the specification and the screenshots are what a contributor needs.
The photography from `design/img/` lives in `src/assets/`.

Where the built site departs from the handoff, it is because the handoff asked
for it (hero contrast) or flagged the gap itself (mobile nav, photo grid
stacking, popup on short viewports). Each departure is explained in the root
`README.md` and in a comment next to the code.

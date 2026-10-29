# Domain Summaries

Domain summaries give your personal assistant background, one paragraph per domain of your life. Approved summaries go into the export text and to assistants over [MCP](./assistant.md).

## Three levels

On the Summaries page (`#/summary`), choose the privacy level:

| Level | Based on | Generated |
|---|---|---|
| All | Every entry that still holds, private and sensitive ones included | Automatically, in the last stage of `build-profile` |
| Normal | Identity, goals, circumstances and preferences at the public or normal level | When you click generate on the page |
| Public | Identity, goals, circumstances and preferences at the public level | When you click generate on the page |

Normal and public summaries are shorter and leave out plans, commitments and outdated information, which change too fast to sit in an assistant's context all the time.

## Generate and approve

- **Generate N domains** makes one model call per domain, usually a minute or two, longer when the model is busy. It runs in the background, so you can leave the page. Domains that fail are filled in by the next run.
- Each summary can be **approved**, **edited** (**Save and approve**) or marked **Don't export**, and an approval can be withdrawn. **Approve all** approves every pending summary.
- Once the portrait behind a summary changes, the summary stops being exported and needs regenerating. It is shared again after you regenerate and approve it.
- A domain with no usable entries (all above the chosen level, or all plans, commitments and outdated information) gets no summary.

## Copy for assistants without MCP

**Export text** at the bottom of the page collects the approved summaries of the chosen level, ready to paste into your assistant's "About me", custom instructions or USER.md.

- **Entries attached per domain** can be none, 3, 5 or 10.
- At the **All** level the text contains private and sensitive content, and you are asked to confirm before copying.

> [!WARNING]
> What you paste can't be taken back, so read it over before copying. To give your assistant less, switch to the normal or public level and generate another one.

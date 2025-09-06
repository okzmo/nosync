export const GET_STARTED_NOTE_TEXT_ONLY = `Hello there! Welcome to Nosync. Let's quickly get you started on how to use it.Nosync helps you organize everything with AI auto - tagging for easy searching.You'll also use:      Branches: Organize your life/work into specific topics    Spaces: Even broader topics, like parents of branches.  Example: A "Life" space could have "Holidays" and "My Cat Collection" branches.  Ready to go? Your new bestfriend is Ctrl+K  (or Cmd+K on mac).  This opens a search and command interface. Just type one of these (or its beginning) and press TAB to use a command:      Note: Create new notes.    Branch: Create or go to a branch.    Space: Create or go to a space.    Upload: Upload files.    Global: Search all branches in your current space.`
export const GET_STARTED_NOTE = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          text: "Hello there! Welcome to Nosync. Let's quickly get you started on how to use it.",
          type: 'text',
        },
        { type: 'hardBreak' },
        { type: 'hardBreak' },
        {
          text: "Nosync helps you organize everything with AI auto-tagging for easy searching. You'll also use:",
          type: 'text',
        },
      ],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                { text: 'Branches:', type: 'text', marks: [{ type: 'bold' }] },
                { text: ' Organize your life/work into specific topics', type: 'text' },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                { text: 'Spaces:', type: 'text', marks: [{ type: 'bold' }] },
                { text: ' Even broader topics, like parents of branches.', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        { text: 'Example:', type: 'text', marks: [{ type: 'bold' }] },
        {
          text: ' A "Life" space could have "Holidays" and "My Cat Collection" branches.',
          type: 'text',
        },
        { type: 'hardBreak' },
        { type: 'hardBreak' },
        { text: 'Ready to go? Your new bestfriend is ', type: 'text' },
        { text: 'Ctrl+K', type: 'text', marks: [{ type: 'code' }] },
        { text: '  (or ', type: 'text' },
        { text: 'Cmd+K', type: 'text', marks: [{ type: 'code' }] },
        { text: ' on mac).', type: 'text' },
        { type: 'hardBreak' },
        { type: 'hardBreak' },
        {
          text: 'This opens a search and command interface. Just type one of these (or its beginning) and press ',
          type: 'text',
        },
        { text: 'TAB', type: 'text', marks: [{ type: 'code' }] },
        { text: ' to use a command:', type: 'text' },
      ],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                { text: 'Note:', type: 'text', marks: [{ type: 'bold' }] },
                { text: ' Create new notes.', type: 'text' },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                { text: 'Branch:', type: 'text', marks: [{ type: 'bold' }] },
                { text: ' Create or go to a branch.', type: 'text' },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                { text: 'Space:', type: 'text', marks: [{ type: 'bold' }] },
                { text: ' Create or go to a space.', type: 'text' },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                { text: 'Upload:', type: 'text', marks: [{ type: 'bold' }] },
                { text: ' Upload files.', type: 'text' },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                { text: 'Global:', type: 'text', marks: [{ type: 'bold' }] },
                { text: ' Search all branches in your current space.', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
  ],
}

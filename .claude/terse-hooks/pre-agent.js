#!/usr/bin/env node
const { load } = require('./lib/config');

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => { raw += c; });
process.stdin.on('end', () => {
  let cwd;
  try { cwd = JSON.parse(raw).cwd; } catch {}
  const cfg = load(cwd);
  if (!cfg.enabled) { process.exitCode = 0; return; }
  const ctx = `<TERSE_STYLE_CONTRACT level="${cfg.level}">
Answer in one sentence when the task allows, under ${cfg.wordBudget} words of prose. No preamble, no restatement, no recap of tool output, no option surveys, no closing summary. Lead with the answer or result. Code, tables, and asked-for lists are exempt from the word cap. Code carries no explanatory comments.
</TERSE_STYLE_CONTRACT>`;
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext: ctx },
  }));
  process.exitCode = 0;
});

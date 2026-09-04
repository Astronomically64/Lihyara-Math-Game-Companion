const fs = require('fs');
const path = require('path');

const root = __dirname;
const source = fs.readFileSync(path.join(root, 'questions-source.txt'), 'utf8').replace(/\r/g, '');
const blocks = source.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
const heading = /^(GRADE\s+\d+\s+QUESTIONS?|Grade\s+\d+|EASY|AVERAGE|DIFFICULT|PORTAL CHALLENGES|FINAL CHALLENGES)(\s|$)/i;
const option = /^(?:A|B|C|D)\.\s*/;
const records = [];

for (const block of blocks) {
  const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
  if (!lines.length || heading.test(lines[0])) continue;

  const answerIndex = lines.findIndex((line) => /^Answer:\s*/i.test(line));
  if (answerIndex < 0) continue;
  let promptLines;
  let answerLines;
  {
    promptLines = lines.slice(0, answerIndex);
    answerLines = lines.slice(answerIndex).map((line, index) => index === 0 ? line.replace(/^Answer:\s*/i, '').trim() : line).filter(Boolean);
  }

  const options = [];
  const cleanPrompt = [];
  for (const line of promptLines) {
    const matches = [...line.matchAll(/(?:^|\s)([A-D])\.\s*([\s\S]*?)(?=(?:\s+[A-D]\.\s*)|$)/g)];
    if (matches.length > 0) {
      options.push(...matches.map((match) => match[2].trim()));
    } else {
      cleanPrompt.push(line);
    }
  }
  const answer = answerLines.join('\n').replace(/^[A-D]\.\s*/, '').trim();
  records.push({ prompt: cleanPrompt.join('\n').trim(), answer, options });
}

const dataPath = path.join(root, 'src', 'data', 'cards.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
if (records.length !== data.cards.length) {
  throw new Error(`Parsed ${records.length} source records, expected ${data.cards.length}.`);
}

data.cards.forEach((card, index) => {
  const record = records[index];
  card.problemText = record.prompt;
  card.expectedAnswer = record.answer;
  card.acceptableAnswers = [record.answer];
  if (record.options.length >= 4) {
    card.questionType = 'multiple_choice';
    card.answers = record.options.slice(0, 4).map((text) => ({ text, isCorrect: text === record.answer }));
  } else if (card.questionType !== 'true_false') {
    card.questionType = 'input';
    card.answers = [];
  }

  if (card.qrId === 'g7d09') {
    card.questionType = 'multiple_choice';
    card.answers = ['a', 'b', 'c', 'd'].map((letter) => ({
      text: letter.toUpperCase(),
      isCorrect: letter.toUpperCase() === record.answer,
      imageRes: `/images/gr7d9mc-${letter}.png`,
    }));
  }
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Imported ${records.length} questions from questions-source.txt.`);
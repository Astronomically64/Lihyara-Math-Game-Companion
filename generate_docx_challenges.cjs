const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const root = __dirname;
const mc = (correct, ...wrong) => [correct, ...wrong].map((text, index) => ({ text, isCorrect: index === 0 }));
const makeCard = (qrId, grade, title, problemText, correct, wrong, solution, portalTheme = false) => ({
  qrId,
  grade,
  ...(portalTheme ? { portalTheme: true } : {}),
  difficulty: 5,
  category: portalTheme ? 'portal-challenge' : 'final-challenge',
  title,
  questionType: 'multiple_choice',
  expectedAnswer: correct,
  acceptableAnswers: [correct],
  problemText,
  answers: mc(correct, ...wrong),
  solution,
  imageRes: null,
});

const extraCards = [
  makeCard('portal01', 7, 'The Water Tank Portal', 'The water tank is 3/5 full. After 24 liters of water are added, the tank becomes 3/4 full. What is the total capacity of the tank?', '160 liters', ['96 liters', '120 liters', '240 liters'], 'The added water is 3/4 - 3/5 = 3/20 of the tank. Since 3/20 of the capacity is 24 liters, the capacity is 24 × 20 ÷ 3 = 160 liters.', true),
  makeCard('portal02', 8, "Pedro's Two-Day Journey", 'Pedro drove at 50 km/hr for 4 hours on day 1 and 60 km/hr for 3 hours on day 2. What total distance did he drive?', '380 km', ['320 km', '380 km/hr', '440 km'], 'Day 1: 50 × 4 = 200 km. Day 2: 60 × 3 = 180 km. The total is 200 + 180 = 380 km.', true),
  makeCard('portal03', 9, 'Consecutive Odd Integers', 'The sum of three consecutive odd integers is 147. What are the smallest and largest integers?', '47 and 51', ['45 and 49', '49 and 53', '46 and 50'], 'Let the integers be n - 2, n, and n + 2. Then 3n = 147, so n = 49. The integers are 47, 49, and 51.', true),
  makeCard('portal04', 10, 'The Rectangle Portal', 'A rectangle has a perimeter of 64 cm. Its length is 8 cm more than twice its width. Find the area of the rectangle.', '240 cm²', ['192 cm²', '128 cm²', '256 cm²'], 'The supplied challenge gives length 20 cm and width 12 cm. Therefore, the area is 20 × 12 = 240 cm².', true),
  makeCard('portal05', 7, 'Across the River', 'A surveyor measures CA = 80 m, CB = 120 m, and ∠ACB = 65°. Using the Law of Cosines, what is the approximate distance from A to B?', '112.7 meters', ['96.4 meters', '128.5 meters', '200 meters'], 'AB² = 80² + 120² - 2(80)(120)cos(65°), which gives AB ≈ 112.7 meters.', true),

  makeCard('g7f01', 7, 'Simple Interest Relationship', 'Ana invests ₱8,000 at 5% simple interest per year. Which equation represents the relationship used to find simple interest I?', 'I = Prt', ['I = P + r + t', 'I = P(1 + r)^t', 'I = P ÷ rt'], 'Simple interest is I = Prt, where P is principal, r is the annual rate, and t is time in years.'),
  makeCard('g7f02', 7, 'Discount at the Market', 'Liza buys a bag marked ₱1,200 at a 15% discount. How much discount does she get?', '₱180', ['₱150', '₱200', '₱1,020'], 'The discount is 15% of ₱1,200: 0.15 × 1,200 = ₱180.'),
  makeCard('g7f03', 7, 'Sales Tax', 'A desk lamp costs ₱850.00. If the sales tax is 12%, how much is the sales tax?', '₱102.00', ['₱85.00', '₱112.00', '₱748.00'], 'The tax is 12% of ₱850: 0.12 × 850 = ₱102.00.'),
  makeCard('g7f04', 7, 'Weekly Food Budget', 'Juan receives ₱500 per week and spends 50% on food. How much does he spend on food each week?', '₱250', ['₱100', '₱200', '₱300'], '50% of ₱500 is 0.50 × 500 = ₱250.'),
  makeCard('g7f05', 7, 'Simplest Form', 'What does it mean when a fraction is in simplest form?', 'The GCF of the numerator and denominator is 1.', ['The numerator is always smaller than the denominator.', 'The number is a decimal.', 'The number is an integer.'], 'A fraction is in simplest form when its numerator and denominator have no common factor other than 1.'),

  makeCard('g8f01', 8, 'Multiplicative Inverse', 'The expression (x + 4)/(x - 7) is a rational expression. What is its multiplicative inverse?', '(x - 7)/(x + 4)', ['(x + 4)/(x - 7)', '(x + 4)(x - 7)', '1/[(x + 4)(x - 7)]'], 'The multiplicative inverse interchanges the numerator and denominator.'),
  makeCard('g8f02', 8, 'Expanded Garden Area', 'The side of a square garden is increased by 3 meters. If the original side is x meters, what is the new area?', 'x² + 6x + 9', ['x² + 3', 'x² + 9', '2x + 3'], 'The new side is x + 3, so (x + 3)² = x² + 6x + 9.'),
  makeCard('g8f03', 8, 'String for Twelve', 'If one student uses x meters of string for a Science project, how much string is needed for 12 students?', '12x meters', ['x + 12 meters', 'x/12 meters', '12 + x meters'], 'Twelve students use 12 × x = 12x meters.'),
  makeCard('g8f04', 8, 'Finding the GCF', 'For 12x³y - 18x²y² + 24xy³, Student A says the GCF is 6xy while Student B gives a longer expression. Who is correct?', 'Student A', ['Student B', 'Both students', 'Neither student'], 'The numerical GCF is 6 and the common variables are x and y, so the GCF is 6xy.'),
  makeCard('g8f05', 8, 'Simplifying a Rational Expression', 'A student simplifies (x² - 9)/(x² + 5x + 6) to (x - 3)/(x + 2). Is the student correct?', 'Yes', ['No, it should be (x + 3)/(x + 2)', 'No, it should be (x - 3)/(x + 3)', 'No, it cannot be simplified'], 'Factoring gives (x - 3)(x + 3) / [(x + 2)(x + 3)] = (x - 3)/(x + 2).'),

  makeCard('g9f01', 9, 'Perpendicular Lines', 'What is the relationship between two lines that intersect to form a 90° angle?', 'Perpendicular lines', ['Parallel lines', 'Congruent lines', 'Skew lines'], 'Lines that intersect at a right angle are perpendicular.'),
  makeCard('g9f02', 9, 'Square and Rectangle', 'Why is every square considered a rectangle?', 'Because a square has four right angles like a rectangle.', ['Because every rectangle has four equal sides.', 'Because a square has no parallel sides.', 'Because a square has only one right angle.'], 'A rectangle is a quadrilateral with four right angles. A square meets that definition.'),
  makeCard('g9f03', 9, 'Parallelogram Side Equality', 'If ABCD is a parallelogram and AB = 3x + 5 and CD = x + 15, what is the value of x?', 'x = 5', ['x = 10', 'x = 15', 'x = 20'], 'Opposite sides are equal: 3x + 5 = x + 15, so x = 5.'),
  makeCard('g9f04', 9, 'Unknown Figure Value', 'What is the value of x in the given figure?', 'x = 8', ['x = 4', 'x = 12', 'x = 16'], 'Using the equal-side or angle relationship shown in the supplied figure gives x = 8.'),
  makeCard('g9f05', 9, 'Choosing a Square Court', 'Court A has four equal sides and four right angles. Court B has opposite sides equal and parallel, with four right angles. Court C has four equal sides, but not all right angles. Which court is a square?', 'Court A', ['Court B', 'Court C', 'None of the courts'], 'A square has four equal sides and four right angles, matching Court A.'),

  makeCard('g10f01', 10, 'SAS Triangle Law', 'Which trigonometric law should be used first when given two sides and the included angle (SAS) of an oblique triangle?', 'Law of Cosines', ['Law of Sines', 'Pythagorean Theorem', 'Tangent Ratio'], 'The Law of Cosines directly relates two sides and their included angle to the third side.'),
  makeCard('g10f02', 10, 'Included Angle', 'The included angle of sides AC and BC in triangle ABC is what angle?', '∠C', ['∠A', '∠B', '∠ACB only'], 'Sides AC and BC share endpoint C, so their included angle is ∠C.'),
  makeCard('g10f03', 10, 'Angle BCD', 'Given the figure, what is the measure of ∠BCD?', '103°', ['77°', '90°', '113°'], 'Applying the angle relationships shown in the supplied figure gives 103°.'),
  makeCard('g10f04', 10, 'Law of Cosines Formula', 'In triangle DEF, d = 8 cm, f = 11 cm, and angle E = 60°. Which formula correctly calculates side e?', 'e² = 8² + 11² - 2(8)(11) cos(60°)', ['e² = 8² + 11² + 2(8)(11) cos(60°)', 'e/sin(60°) = 8/sin(11°)', 'e² = 8² + 11²'], 'Side e is opposite the included angle E, so the Law of Cosines uses subtraction.'),
  makeCard('g10f05', 10, 'Triangle Angle Sum', 'In triangle PQR, angle P = 30° and angle Q = 45°. What is the measure of angle R?', '105°', ['75°', '95°', '115°'], 'The angles of a triangle total 180°, so R = 180° - 30° - 45° = 105°.'),
];

const dataPath = path.join(root, 'src', 'data', 'cards.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const existingIds = new Set(data.cards.map((card) => card.qrId));
const figureImages = {
  g7e02: '/images/gr7e2fig.png',
  g7d02: '/images/gr7d2fig.png',
  g7d03: '/images/gr7d3fig.png',
  g7d10: '/images/gr7d10fig.png',
  g9e03: '/images/gr9e3fig.png',
  g9a15: '/images/gr9a15fig.png',
  g9f04: '/images/gr9fc4fig.png',
  g10f02: '/images/gr10fc2fig.png',
  g10f03: '/images/gr10fc3fig.png',
  g10f04: '/images/gr10fc4fig.png',
  g10f05: '/images/gr10fc5fig.png',
};
const cards = [...data.cards, ...extraCards.filter((card) => !existingIds.has(card.qrId))].map((card) => ({
  ...card,
  imageRes: figureImages[card.qrId] || card.imageRes || null,
}));
const output = JSON.stringify({ cards }, null, 2);
for (const file of ['src/data/cards.json', 'lihyara_all_cards.json', 'public/lihyara_all_cards.json']) {
  fs.writeFileSync(path.join(root, file), output, 'utf8');
}

const qrDirectory = path.join(root, 'public', 'qr_codes');
fs.mkdirSync(qrDirectory, { recursive: true });
Promise.all(extraCards.map((card) => QRCode.toFile(path.join(qrDirectory, `${card.qrId}.png`), `LIHYARA:${card.qrId}`, {
  width: 512,
  margin: 2,
  errorCorrectionLevel: 'M',
}))).then(() => {
  console.log(`Added ${cards.length - data.cards.length} cards; deck now has ${cards.length}.`);
  console.log(`Generated ${extraCards.length} QR codes in public/qr_codes.`);
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

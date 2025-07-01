// services/email-extractor.js
function removeQuotedLines(text) {
    return text
        .split('\n')
        .filter((line) => !line.trim().startsWith('>'))
        .join('\n');
}

function removeLinks(text) {
    return text.replace(/<?https?:\/\/[^\s>]+>?/g, '');
}

function removeHeadersAndAbove(text) {
    const lines = text.split('\n');
    const bodyIndex = lines.findIndex((line) => line.toLowerCase().startsWith('body:'));
    return bodyIndex !== -1 ? lines.slice(bodyIndex + 1).join('\n') : text;
}

function removeReplyHistory(text) {
    const lines = text.split('\n');
    const cutoffIndex = lines.findIndex((line) => /^ *(from:|sent:|body:)/i.test(line.trim()));
    return cutoffIndex !== -1 ? lines.slice(0, cutoffIndex).join('\n').trim() : text;
}

function removeFooterFluff(text) {
    return text
        .split('\n')
        .filter((line) => {
            const trimmed = line.trim().toLowerCase();
            return (
                trimmed &&
                !/^[-\s]{3,}$/.test(trimmed) &&
                !trimmed.includes('book a meeting') &&
                !trimmed.includes('bonterra company') &&
                !/^\s{8,}$/.test(trimmed)
            );
        })
        .join('\n');
}

function normalizeWhitespace(text) {
    return text
        .replace(/^ *<> *$/gm, '')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]+$/gm, '')
        .trim();
}

function extractFirstEmail(rawEmail) {
    let step1 = removeQuotedLines(rawEmail);
    let step2 = removeLinks(step1);
    let step3 = removeHeadersAndAbove(step2);
    let step4 = removeReplyHistory(step3);
    let step5 = removeFooterFluff(step4);
    let step6 = normalizeWhitespace(step5);
    return step6;
}

module.exports = { extractFirstEmail };

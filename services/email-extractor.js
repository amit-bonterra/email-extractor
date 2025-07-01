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

    const fromIndex = lines.findIndex((line) => /^from:/i.test(line.trim()));
    if (fromIndex !== -1) {
        return lines.slice(0, fromIndex).join('\n').trim();
    }

    const sentIndex = lines.findIndex((line) => /^sent:/i.test(line.trim()));
    if (sentIndex !== -1) {
        return lines.slice(0, sentIndex).join('\n').trim();
    }

    const bodyIndex = lines.findIndex((line) => /^body:/i.test(line.trim()));
    if (bodyIndex !== -1 && bodyIndex + 1 < lines.length) {
        return lines
            .slice(bodyIndex + 1)
            .join('\n')
            .trim();
    }

    // Fallback: return the whole thing
    return text.trim();
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
                !trimmed.includes('disclaimer') &&
                !/^\s{8,}$/.test(trimmed)
            );
        })
        .join('\n');
}

function removeZoomBlock(text) {
    const lines = text.split('\n');
    const startIndex = lines.findIndex((line) => /^join zoom meeting/i.test(line.trim()));
    const endIndex = lines.findIndex((line) => /find your local number/i.test(line.trim()));

    // If both found and valid range
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        lines.splice(startIndex, endIndex - startIndex + 1);
    }

    return lines.join('\n').trim();
}

function removeCalendlyBlock(text) {
    const lines = text.split('\n');
    const startIndex = lines.findIndex((line) => /^event name:/i.test(line.trim()));
    const endIndex = lines.findIndex((line) => /powered by calendly/i.test(line.trim()));

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        lines.splice(startIndex, endIndex - startIndex + 1);
    }

    return lines.join('\n').trim();
}

function removeQuotedReplyBlock(text) {
    const lines = text.split('\n');

    const replyStartIndex = lines.findIndex((line) => /^on\s.+wrote:$/i.test(line.trim()));

    if (replyStartIndex !== -1) {
        return lines.slice(0, replyStartIndex).join('\n').trim();
    }

    return text;
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
    let step6 = removeZoomBlock(step5);
    let step7 = removeCalendlyBlock(step6);
    let step8 = removeQuotedReplyBlock(step7);
    let step9 = normalizeWhitespace(step8);
    return step9;
}

module.exports = { extractFirstEmail };

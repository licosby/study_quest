import { Request, Response } from 'express';
import { dataStore } from '../models/storage.js';
import { generateMnemonicForTerm } from '../services/geminiService.js';
import { MnemonicItem } from '../models/types.js';

export class MnemonicController {
  static getAllMnemonics(req: Request, res: Response) {
    try {
      const subject = req.query.subject as string;
      const chapters = dataStore.getChapters();
      let allMnemonics: MnemonicItem[] = [];

      chapters.forEach((ch) => {
        allMnemonics.push(...ch.mnemonics);
        // Also extract from keyConcepts
        ch.keyConcepts.forEach((kc, idx) => {
          if (kc.mnemonic) {
            allMnemonics.push({
              id: `kc-mnem-${ch.id}-${idx}`,
              target: kc.term,
              phrase: kc.mnemonic,
              explanation: kc.definition,
              subject: ch.subject,
            });
          }
        });
      });

      if (subject && subject !== 'all') {
        allMnemonics = allMnemonics.filter((m) => m.subject.toLowerCase() === subject.toLowerCase());
      }

      return res.json({ mnemonics: allMnemonics });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch mnemonics' });
    }
  }

  static async generateMnemonic(req: Request, res: Response) {
    try {
      const { term, context, subject } = req.body;
      if (!term) {
        return res.status(400).json({ error: 'Term is required to generate mnemonic' });
      }

      const generated = await generateMnemonicForTerm(term, context || '', subject || 'General');
      return res.json({
        term,
        mnemonic: generated.phrase,
        explanation: generated.explanation,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to generate mnemonic' });
    }
  }
}

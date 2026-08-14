import { Injectable } from '@nestjs/common';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';

export interface StoredFile {
  path: string; // valeur stockée telle quelle dans CV.photoUrl
}

/**
 * Implémentation "disque local".
 * Contrat à respecter par toute future implémentation (ex: Supabase Storage) :
 *  - saveFile(buffer, filename, subfolder) -> { path }
 *  - deleteFile(path) -> void
 * Le reste de l'application (controller, service, DTO, frontend) ne dépend
 * jamais du disque directement : tout passe par cette classe.
 */
@Injectable()
export class StorageService {
  private readonly uploadRoot = join(process.cwd(), 'uploads');

  async saveFile(
    buffer: Buffer,
    filename: string,
    subfolder: string,
  ): Promise<StoredFile> {
    const dir = join(this.uploadRoot, subfolder);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, filename), buffer);
    return { path: `/uploads/${subfolder}/${filename}` };
  }

  async deleteFile(path: string): Promise<void> {
    // path attendu au format "/uploads/xxx/yyy.ext"
    if (!path?.startsWith('/uploads/')) return;
    const relative = path.replace('/uploads/', '');
    try {
      await unlink(join(this.uploadRoot, relative));
    } catch {
      // fichier déjà absent : pas bloquant
    }
  }
}
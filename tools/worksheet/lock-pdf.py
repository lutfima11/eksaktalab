"""Kunci izin PDF worksheet: boleh dibuka & dicetak, tidak boleh diedit/disalin.

Dipanggil oleh tools/build-worksheet.mjs:  python lock-pdf.py <masuk.pdf> <keluar.pdf>
Butuh: pip install pypdf cryptography  (AES-256)

Owner password dibuat acak tiap build dan tidak disimpan; worksheet selalu
dibangun ulang dari sumber .tex, jadi PDF terkunci tidak perlu dibuka kembali.
"""
import secrets
import sys

from pypdf import PdfReader, PdfWriter
from pypdf.constants import UserAccessPermissions as P

src, dst = sys.argv[1], sys.argv[2]
writer = PdfWriter(clone_from=PdfReader(src))
allowed = P.PRINT | P.PRINT_TO_REPRESENTATION | P.EXTRACT_TEXT_AND_GRAPHICS
writer.encrypt(user_password='', owner_password=secrets.token_urlsafe(24),
               permissions_flag=allowed, algorithm='AES-256')
with open(dst, 'wb') as f:
    writer.write(f)

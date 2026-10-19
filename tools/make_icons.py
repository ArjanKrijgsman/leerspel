"""Maakt de PNG-app-iconen (180, 192, 512 px) zonder extra pakketten.
Gebruik: py tools/make_icons.py  (vanuit de projectmap)"""
import math
import struct
import zlib
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "app" / "icons"
BG = (0x7A, 0x5C, 0xFF)
STAR = (0xFF, 0xC9, 0x3C)
INK = (0x22, 0x22, 0x3A)

# ster in een 100x100 vlak (zelfde als icon.svg)
PTS = []
for i in range(10):
    a = math.radians(-90 + i * 36)
    r = 37 if i % 2 == 0 else 16.5
    PTS.append((50 + r * math.cos(a), 52 + r * math.sin(a)))


def inside(x, y):
    c = False
    j = len(PTS) - 1
    for i in range(len(PTS)):
        xi, yi = PTS[i]
        xj, yj = PTS[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            c = not c
        j = i
    return c


def edge_dist(x, y):
    best = 1e9
    for i in range(len(PTS)):
        (x1, y1), (x2, y2) = PTS[i], PTS[(i + 1) % len(PTS)]
        dx, dy = x2 - x1, y2 - y1
        t = max(0, min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)))
        best = min(best, math.hypot(x - (x1 + t * dx), y - (y1 + t * dy)))
    return best


def color_at(x, y):
    # gezichtje
    for ex in (44, 56):
        if math.hypot(x - ex, y - 50) < 3.2:
            return INK
    if 45 < x < 55 and abs(y - (58 + 4 * (1 - ((x - 50) / 5.5) ** 2))) < 1.5:
        return INK
    d = edge_dist(x, y)
    if d < 2.5:
        return INK
    return STAR if inside(x, y) else BG


def render(size, ss=3):
    rows = []
    for py in range(size):
        row = bytearray([0])
        for px in range(size):
            acc = [0, 0, 0]
            for sy in range(ss):
                for sx in range(ss):
                    x = (px + (sx + 0.5) / ss) * 100 / size
                    y = (py + (sy + 0.5) / ss) * 100 / size
                    c = color_at(x, y)
                    for k in range(3):
                        acc[k] += c[k]
            row += bytes(v // (ss * ss) for v in acc)
        rows.append(bytes(row))
    raw = b"".join(rows)

    def chunk(tag, data):
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b""))


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for s in (180, 192, 512):
        (OUT / f"icon-{s}.png").write_bytes(render(s))
        print("gemaakt:", OUT / f"icon-{s}.png")

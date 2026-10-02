#!/bin/sh
# Usage: inkbox.sh <comp.png> <build.png> — prints ink bounding boxes per window for both images.
C=$1; B=$2
for w in "wordmark-name 380x55+40+5" "descriptor 380x22+40+62" "nav-links 700x40+480+30" "lang 110x40+1250+30" "give 190x80+1340+5" "eyebrow 650x50+50+170" "headline 670x260+50+220" "lede 670x115+50+485" "ask 270x110+40+600" "refer 250x110+310+600" "mission-label 340x36+600+762" "dash 340x26+600+799" "quote 1250x175+150+826"; do
  set -- $w; name=$1; geo=$2
  c=$(magick "$C" -crop $geo +repage -colorspace gray -threshold 55% -negate -trim -format "%wx%h%X%Y" info: 2>/dev/null)
  b=$(magick "$B" -crop $geo +repage -colorspace gray -threshold 55% -negate -trim -format "%wx%h%X%Y" info: 2>/dev/null)
  printf "%-14s comp %-16s build %s\n" "$name" "$c" "$b"
done

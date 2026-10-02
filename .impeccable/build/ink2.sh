#!/bin/sh
# Usage: ink2.sh <comp.png> <build.png> "name WxH+X+Y [blue]" ... — ink boxes (absolute) per window.
C=$1; B=$2; shift 2
box() { # img geo mode
  ox=$(echo "$2" | sed -E 's/.*\+([0-9]+)\+([0-9]+)$/\1/'); oy=$(echo "$2" | sed -E 's/.*\+([0-9]+)\+([0-9]+)$/\2/')
  if [ "$3" = blue ]; then r=$(magick "$1" -crop "$2" +repage -fx "(b-r>0.25)?1:0" -threshold 50% -negate -trim -format "%w %h %X %Y" info: 2>/dev/null)
  else r=$(magick "$1" -crop "$2" +repage -colorspace gray -threshold 45% -negate -trim -format "%w %h %X %Y" info: 2>/dev/null); fi
  set -- $r; echo "x$(( $3 + ox ))-$(( $3 + ox + $1 )) y$(( $4 + oy ))-$(( $4 + oy + $2 ))"
}
for w in "$@"; do set -- $w; printf "%-12s comp %-24s build %s\n" "$1" "$(box "$C" "$2" "$3")" "$(box "$B" "$2" "$3")"; done

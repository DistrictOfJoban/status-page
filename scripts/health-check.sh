commit=true
origin=$(git remote get-url origin)
if [[ $origin == *statsig-io/statuspage* ]]
then
  commit=false
fi

KEYSARRAY=()
URLSARRAY=()
HISTORY=90

urlsConfig="public/urls.cfg"
echo "Reading $urlsConfig"
while read -r line
do
  echo "  $line"
  IFS='=' read -ra TOKENS <<< "$line"
  KEYSARRAY+=(${TOKENS[0]})
  URLSARRAY+=(${TOKENS[1]})
done < "$urlsConfig"

echo "***********************"
echo "Starting health checks with ${#KEYSARRAY[@]} configs:"

mkdir -p logs

for (( index=0; index < ${#KEYSARRAY[@]}; index++))
do
  key="${KEYSARRAY[index]}"
  url="${URLSARRAY[index]}"
  echo "  $key=$url"

  for i in 1 2 3; 
  do
    response=$(curl -o /dev/null --max-time 30 -s -L -w '%{http_code} %{time_total}' --silent --output /dev/null $url)
    exit_code=$?
    http_code=$(echo $response | cut -d ' ' -f 1)
    time_total=$(echo $response | cut -d ' ' -f 2)
    echo "    $http_code $time_total"
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 202 ] || [ "$http_code" -eq 301 ] || [ "$http_code" -eq 302 ] || [ "$http_code" -eq 307 ] || [ "$exit_code" -eq 52 ]; then
      result="success"
    else
      result="failed"
    fi
    if [ "$result" = "success" ]; then
      break
    fi
    sleep 5
  done
  dateTime=$(date +'%Y-%m-%d %H:%M')
  if [[ $commit == true ]]
  then
    echo $dateTime, $result, $time_total >> "public/status/${key}_report.log"
    echo "$(tail -$((HISTORY*24)) ./public/status/${key}_report.log)" > "public/status/${key}_report.log"
  else
    echo "    $dateTime, $result, $time_total"
  fi
done

if [[ $commit == true ]]
then
  git config --global user.name 'The District Of Joban'
  git config --global user.email 'districtofjoban@gmail.com'
  git add -A --force public/status/
  git commit -am '[Auto] Updated Status'
  git push
fi

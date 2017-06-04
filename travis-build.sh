docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD";
VERSION=`node -e "console.log(require('./package.json').version);"`;
if [ "$TRAVIS_BRANCH" != "master" ]; then
  sed -i "s/$VERSION/$VERSION-${TRAVIS_COMMIT}/g" package.json;
fi
docker build -t theconnman/missd .;
if [ "$TRAVIS_BRANCH" == "master" ]; then
  docker tag theconnman/missd theconnman/missd:$VERSION;
  docker push theconnman/missd:latest;
  docker push theconnman/missd:$VERSION;
elif [ "$TRAVIS_BRANCH" == "dev" ]; then
  docker tag theconnman/missd theconnman/missd:latest-dev;
  docker push theconnman/missd:latest-dev;
else
  docker tag theconnman/missd theconnman/missd:${TRAVIS_BRANCH#*/};
  docker push theconnman/missd:${TRAVIS_BRANCH#*/};
fi

# ... build and push to sentry ... #

# install sentry cli
echo "Installing and configuring sentry cli"
curl -L -o sentry-cli https://github.com/getsentry/sentry-cli/releases/download/1.40.0/sentry-cli-Linux-x86_64
chmod u+x sentry-cli
./sentry-cli --version
export SENTRY_ORG=rhocode
export SENTRY_PROJECT=5311573
# create sentry release and upload source maps
echo "Creating release"
./sentry-cli releases new ${COMMIT_REF::7}
echo "Setting release commits"
./sentry-cli releases set-commits --commit "rhocode/Giraffe@$COMMIT_REF" ${COMMIT_REF::7}
echo "Link deploy to release"
./sentry-cli releases deploys ${COMMIT_REF::7} new -e $SENTRY_ENV
echo "Uploading source maps"
./sentry-cli releases files ${COMMIT_REF::7} upload-sourcemaps build/static/js/ --rewrite --url-prefix '~/static/js'
echo "Finalizing release"
./sentry-cli releases finalize ${COMMIT_REF::7}

# ... delete source maps ... #
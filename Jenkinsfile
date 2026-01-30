pipeline {
    agent {
        label 'cypress-node'
    }

    triggers {
        cron('30 20 * * 0-5')
    }

    options {
        ansiColor('xterm')
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '20'))
        disableConcurrentBuilds()
        skipDefaultCheckout()
        timeout(time: 60, unit: 'MINUTES')
    }

    environment {
        ALLURE_PATH = 'testes/ui/allure-results'
        WORKSPACE_DIR = "${env.WORKSPACE}"
        CYPRESS_CACHE_FOLDER = '/root/.cache/Cypress'
        CI = 'true'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Executar Testes Cypress') {
            steps {
                script {
                    withDockerRegistry(
                        credentialsId: 'jenkins_registry',
                        url: 'https://registry.sme.prefeitura.sp.gov.br/repository/sme-registry/'
                    ) {
                        withCredentials([
                            file(credentialsId: 'cypress_env_autosservico', variable: 'ENV_FILE')
                        ]) {
                            sh '''
                                echo "📁 Preparando variáveis de ambiente"
                                mkdir -p tests/api
                                cp "$ENV_FILE" tests/api/.env

                                docker pull registry.sme.prefeitura.sp.gov.br/devops/cypress-agent:14.5.2

                                docker run --rm \
                                  -e CI=true \
                                  -e CYPRESS_CACHE_FOLDER=/root/.cache/Cypress \
                                  -v "$WORKSPACE/testes/ui:/app" \
                                  -v "$WORKSPACE/.cache:/root/.cache" \
                                  -w /app \
                                  registry.sme.prefeitura.sp.gov.br/devops/cypress-agent:14.5.2 \
                                  sh -c "
                                    echo '🧹 Limpando ambiente...' &&
                                    rm -rf node_modules package-lock.json allure-results &&

                                    echo '📦 Instalando dependências (npm ci)...' &&
                                    npm ci &&

                                    echo '🧪 Executando Cypress (headless)...' &&
                                    npx cypress run \
                                      --browser chrome \
                                      --headless \
                                      --config viewportWidth=1920,viewportHeight=1080,video=false &&
                                      
                                    echo '🔐 Ajustando permissões...' &&
                                    chown -R 1001:1001 . &&
                                    chmod -R 777 .
                                  "
                            '''
                        }
                    }

                    echo "✅ Testes Cypress finalizados."

                    def logText = currentBuild.rawBuild.getLog(50).join('\n')
                    def match = logText =~ /Recorded Run:\s*(https?:\/\/\S+)/
                    if (match) {
                        env.CYPRESS_RUN_URL = match[0][1]
                    }
                }
            }
        }

        stage('Gerar Relatório Allure') {
            steps {
                script {
                    catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {

                        def hasResults = fileExists("${ALLURE_PATH}") &&
                            sh(
                                script: "ls -A ${ALLURE_PATH} | wc -l",
                                returnStdout: true
                            ).trim() != "0"

                        if (hasResults) {
                            echo "📊 Gerando relatório Allure..."
                            sh """
                                export JAVA_HOME=\$(dirname \$(dirname \$(readlink -f \$(which java))))
                                export PATH=\$JAVA_HOME/bin:\$PATH

                                allure generate ${ALLURE_PATH} \
                                  --clean \
                                  --output testes/ui/allure-report

                                cd testes/ui
                                zip -r allure-results-${BUILD_NUMBER}-\$(date +"%d-%m-%Y").zip allure-results
                            """
                        } else {
                            echo "⚠️ Nenhum resultado Allure encontrado."
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            script {

                if (fileExists("${ALLURE_PATH}") &&
                    sh(script: "ls -A ${ALLURE_PATH} | wc -l", returnStdout: true).trim() != "0") {

                    allure includeProperties: false, jdk: '', results: [[path: "${ALLURE_PATH}"]]
                } else {
                    echo "⚠️ Allure não acionado (sem resultados)."
                }

                def zipExists = sh(
                    script: "ls testes/ui/allure-results-*.zip 2>/dev/null || true",
                    returnStdout: true
                ).trim()

                if (zipExists) {
                    archiveArtifacts artifacts: 'testes/ui/allure-results-*.zip', fingerprint: true
                }
            }
        }

        success  { sendTelegram("<b>SUCESSO! ✅</b>") }
        unstable { sendTelegram("<b>INSTÁVEL! ⚠️</b>") }
        failure  { sendTelegram("<b>FALHA! ❌</b>") }
        aborted  { sendTelegram("<b>CANCELADO! ✖️</b>") }
    }
}

/* ===============================
   TELEGRAM
   =============================== */
def sendTelegram(message) {

    def messageTemplate = (
        "<b>Job:</b> <a href='${JOB_URL}'>${JOB_NAME}</a>\n\n" +
        "<b>Status:</b> ${message}\n" +
        "<b>Build:</b> ${BUILD_DISPLAY_NAME}\n" +
        "<b>Cypress:</b> <a href='${env.CYPRESS_RUN_URL}'>Dashboard</a>\n" +
        "<b>Log:</b> <a href='${env.BUILD_URL}console'>Console</a>"
    )

    def encodedMessage = URLEncoder.encode(messageTemplate, "UTF-8")

    withCredentials([
        string(credentialsId: 'telegramTokensigpae', variable: 'TOKEN'),
        string(credentialsId: 'telegramChatIdsigpae', variable: 'CHAT_ID')
    ]) {
        httpRequest(
            httpMode: 'GET',
            contentType: 'APPLICATION_JSON',
            url: "https://api.telegram.org/bot${TOKEN}/sendMessage" +
                 "?text=${encodedMessage}&chat_id=${CHAT_ID}" +
                 "&parse_mode=HTML&disable_web_page_preview=true",
            validResponseCodes: '200'
        )
    }
}

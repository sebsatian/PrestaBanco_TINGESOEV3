pipeline {
    agent any
    tools {
        maven 'maven_3_8_1'
        nodejs 'node'
    }
    stages {

        stage('Checkout repository') {
            steps {
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/sebsatian/PrestaBanco_TINGESOEV1']])
            }
        }

        stage('Build backend') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'cd BackendPrestaBanco && mvn clean package'
                    } else {
                        bat 'cd BackendPrestaBanco && mvn clean package'
                    }
                    
                }
            }
        }
        stage('Test backend') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'cd BackendPrestaBanco && mvn test'
                    } else {
                        bat 'cd BackendPrestaBanco && mvn test'
                    }
                }
            }
        }
        stage('Push backend') {
            steps {

                script {
                    if (isUnix()) {
                        sh 'docker build -t sebsatian/backend-prestabanco:latest BackendPrestaBanco'
                    } else {
                        bat 'docker build -t sebsatian/backend-prestabanco:latest BackendPrestaBanco'
                    }
                }
                withCredentials([string(credentialsId: 'dockerhubpassword', variable: 'dockerpw')]) {
                    script {
                        if (isUnix()) {
                            sh 'docker login -u sebsatian -p ${dockerpw}'
                        } else {
                            bat 'docker login -u sebsatian -p %dockerpw%'
                        }
                    }
                }
                script {
                    if (isUnix()) {
                        sh 'docker push sebsatian/backend-prestabanco:latest'
                    } else {
                        bat 'docker push sebsatian/backend-prestabancoo:latest'
                    }
                }
            }
        }
        stage('Build frontend') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'cd FrontendPrestaBanco && npm run build'
                    } else {
                        bat 'cd FrontendPrestaBanco && npm run build'
                    }
                }
            }
        }
        stage('Push frontend') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker build -t sebsatian/frontend-prestabanco:latest FrontendPrestaBanco'
                    } else {
                        bat 'docker build -t sebsatian/frontend-prestabanco:latest FrontendPrestaBanco'
                    }
                }

                withCredentials([string(credentialsId: 'dockerhubpassword', variable: 'dockerpw')]) {
                    script {
                        if (isUnix()) {
                            sh 'docker login -u sebsatian -p ${dockerpw}'
                        } else {
                            bat 'docker login -u sebsatian -p %dockerpw%'
                        }
                    }
                }
                script {
                    if (isUnix()) {
                        sh 'docker push sebsatian/frontend-prestabanco:latest'
                    } else {
                        bat 'docker push sebsatian/frontend-prestabanco:latest'
                    }
                }
            }
        }
    }
}
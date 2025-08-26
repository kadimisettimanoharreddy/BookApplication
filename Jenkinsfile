pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/kadimisettimanoharreddy/BookApplication.git'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                kubectl apply -f k8s/namespace.yaml
                kubectl apply -f k8s/postgres.yaml
                kubectl apply -f k8s/backend.yaml
                kubectl apply -f k8s/frontend.yaml
                '''
            }
        }

        stage('Verify Pods and Services') {
            steps {
                sh '''
                kubectl get pods -n books
                kubectl get svc -n books
                '''
            }
        }
    }
}

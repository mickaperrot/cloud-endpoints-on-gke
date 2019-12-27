# Google Cloud Endpoints sample with Firebase Auth on GKE

This sample demonstrates how to use Google Cloud Endpoints with Firebase authentication and GKE backend.

Based on:
[Google Cloud Endpoints on GKE Quickstart](https://cloud.google.com/endpoints/docs/openapi/get-started-kubernetes-engine).
[Firebase Authentication](https://github.com/firebase/quickstart-js/blob/master/auth/README.md).

## Deploy Firebase authentication website

Refer to [Firebase Authentication](https://github.com/firebase/quickstart-js/blob/master/auth/README.md).

 1. Create a Firebase project on the [Firebase Console](https://console.firebase.google.com).
 1. Add a support email to your project in the [settings page](https://console.firebase.google.com/u/0/project/_/settings/general/). Some auth methods won't work without this.
 1. Enable the authentication method you want to use by going to the **Authentication** section in the **SIGN-IN METHOD** tab - you don't need to enable custom auth.
     - For **Custom Auth**, generate a Service Account credentials in your [Firebase Console > Project Settings > Service Accounts](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk), and click on **GENERATE NEW PRIVATE KEYS**. You will need it in the [example token generator](exampletokengenerator/auth.html).
     - For **Facebook**, **Twitter** and **GitHub** you will need to create an application as a developer on their respective developer platform, whitelist `https://<project_id>.firebaseapp.com/__/auth/handler` for auth redirects and enable and setup the app's credentials in the **Firebase Console > Authentication > SIGN-IN METHOD**.
 1. You must have the [Firebase CLI](https://firebase.google.com/docs/cli/) installed. If you don't have it install it with `npm install -g firebase-tools` and then configure it with `firebase login`.
 1. On the command line, `cd` into the `authentication-website` directory. 
 1. Run `firebase use --add` and select your Firebase project.

To run the sample app locally during development:
 1. Run `firebase serve`. 
    This will start a server locally that serves `index.html` on `http://localhost:<port>`. Check the output of the command for the exact port.
 1. Navigate in your browser to the URL output by the `firebase serve` command. 

To deploy the sample app to production:
 1. Run `firebase deploy`.
    This will deploy the sample app to `https://<project_id>.firebaseapp.com`.

## Configure the Endpoint API

Edit openapi.yaml.

Configure the host with unique name and configure the project ID.

Deploy the API:

```
gcloud endpoints services deploy openapi.yaml
```

## Build the container image

Build the container image:

```
docker build -t my-image .
```

Tag the image:

```
docker tag my-image gcr.io/[PROJECT-ID]/my-image
```

Push the image:

```
docker push gcr.io/[PROJECT-ID]/my-app
```

## Deploy the GKE cluster

Create a GKE cluster.

Get cluster credentials:

```
gcloud container clusters get-credentials NAME --zone ZONE
```

Edit endpoints.yaml:
1. Replace service with the endpoint service name.
1. Replace image with the docker image create in the previous step.

Deploy the configuration:

```
kubectl apply -f deployment.yaml
```

Get the external IP address:

```
kubectl get service
```

## Call the API with the IP address

Get the endpoints key by login into:

```
https://PROJECT-ID.firebaseapp.com/email-password.html
```

Call the API using the service IP:

```
curl --request GET \
   --header "content-type:application/json" \
   "http://IP_ADDRESS:80/headers?access_token=TOKEN"
```

## Configure the DNS name

Edit openapi.yaml.

Configure the x-google-endpoints section with the endpoint service name and the service IP address.

Deploy the endpoint configuration:

```
gcloud endpoints services deploy openapi.yaml
```

Call the API using the DNS name:

```
curl --request GET "http://DNS_NAME:80/headers?access_token=TOKEN"
```

# Basic Cloud Endpoints on GKE test

## Deploy the API definition

Deploy the OpenAPI definition:

```
gcloud endpoints services deploy my-api.yaml 
```

## Build the container image

Build the container image:

```
docker build -t [IMAGE-NAME] .
```

Tag the image:

```
docker tag [IMAGE-NAME] gcr.io/[PROJECT-ID]/[IMAGE-NAME]
```

Push the image:

```
docker push gcr.io/[PROJECT-ID]/[IMAGE-NAME]
```

## Deploy the k8s backend

Create the cluster:

```
gcloud container clusters create [CLUSTER-NAME] --zone [ZONE]
```

Get the cluster's credentials:

```
gcloud container clusters get-credentials [CLUSTER-NAME] --zone [ZONE]
```

Create a static IP address:

```
gcloud compute addresses create [IP-ADDRESS-NAME] --global
```

Get the created IP address:

```
gcloud compute addresses describe [IP-ADDRESS-NAME] --global
```

Edit api-credentials.yaml:
1. Replace service with the endpoint service name.
1. Replace image with the docker image create in the previous step.
1. Set the IP address just created

Deploy the configuration:

```
kubectl apply -f api-credentials.yaml
```

Get the external IP address:

```
kubectl get ingress
```

## Test the endpoint

Try calling the endpoint:

```
curl --request POST \
   --header "content-type:application/json" \
   --data '{"message":"hello world"}' \
   "http://[INGRESS-IP]:80/echo"
```

## Configure the DNS name

Edit my-api.yaml.

Configure the x-google-endpoints section with the endpoint service name and the ingress IP address.

Deploy the endpoint configuration:

```
gcloud endpoints services deploy my-api.yaml
```

Call the API using the DNS name:

```
curl --request POST \
   --header "content-type:application/json" \
   --data '{"message":"hello world"}' \
   "http://[DNS-NAME]:80/echo"
```

Verify the certificate is deployed:

```
kubectl describe managedcertificate
```

# Troubleshooting
Start a container running inside the cluster:
 ```
 kubectl run -it --rm --restart=Never alpine --image=alpine
 ```
 Once inside the cluster install Curl:
 ```
 apk add curl
 ```
 
 Start a shell from a running pod:
 
 ```
 kubectl exec -it [POD] -c [CONTAINER] -- /bin/sh
 ```

 ## Build the image for service 1

 Move to service 1 directory:
 
 ```
 cd ./docker/service1
 ```

 Build the image:

 ```
 docker build -t service1 .
 ```

 Tag the image:
 
 ```
 docker tag service1 gcr.io/[PROJECT-ID]/service1
 ```
 
 Push the image:
 
 ```
 docker push gcr.io/[PROJECT-ID]/service1
 ```

## Build the image for service 2

 Move to service 2 directory:
 
 ```
 cd ./docker/service2
 ```

 Build the image:

 ```
 docker build -t service2 .
 ```

 Tag the image:
 
 ```
 docker tag service2 gcr.io/[PROJECT-ID]/service2
 ```
 
 Push the image:
 
 ```
 docker push gcr.io/[PROJECT-ID]/service2
 ```
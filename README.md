# Docusign and JPMorgan Account Opening Implementation

## Introduction
This joint use case between Docusign and JPMorgan Chase demonstrates how financial institutions can modernize the account opening experience by combining workflow orchestration, identity validation, and agreement execution into a single, streamlined process.

The solution uses Docusign Maestro to orchestrate the end-to-end workflow and integrates with JPMorgan validation services to perform entity and account verification. Docusign Data IO securely exchanges data between systems, enabling real-time validation and reducing manual intervention.

Together, these components create a compliant, automated account opening flow that accelerates onboarding, improves data accuracy, and delivers a seamless customer experience.

These verification endpoints from JPMorgan are used:

- [Entity verification](https://developer.payments.jpmorgan.com/docs/fraud-solutions/validation-services/capabilities/entity-validation)
- [Account verification](https://developer.payments.jpmorgan.com/docs/fraud-solutions/validation-services/capabilities/account-validation)

## Authentication
This reference implementation supports two [authentication](https://developers.docusign.com/extension-apps/build-an-extension-app/it-infrastructure/authorization/) flows:
* [Authorization Code Grant](https://developers.docusign.com/extension-apps/build-an-extension-app/it-infrastructure/authorization/#authorization-code-grant) – required for public extension apps
* [Client Credentials Grant](https://developers.docusign.com/extension-apps/build-an-extension-app/it-infrastructure/authorization/#client-credentials-grant) – available to private extension apps. See [Choosing private distribution instead of public](https://developers.docusign.com/extension-apps/extension-apps-101/choosing-private-distribution/).

*Private extension apps can use either authentication method, but public extension apps must use Authorization Code Grant.*

## Hosted version (no setup required)
You can use the hosted version of this reference implementation by directly uploading the appropriate manifest file located in the [manifests/hosted/](manifests/hosted) folder to the Docusign Developer Console. See [Upload your manifest](#3-upload-your-manifest).

**Note:** The provided manifest includes `clientId` and `clientSecret` values used in the sample authentication connection. These do not authenticate to a real system, but the hosted reference implementation requires these exact values.

## Choose your setup: local
If you want to run the app locally using Node.js and ngrok, follow the [Local setup instructions](#local-setup-instructions) below.

### 1. Clone the repository
Run the following command to clone the repository:

```bash
git clone https://github.com/docusign/automated-account-opening-implementation.git
```

### 2. [Install and configure Node.js and npm on your machine.](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### 3. Generate secret values
If you already have values for `JWT_SECRET_KEY`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, and `AUTHORIZATION_CODE`, you may skip this step.

The easiest way to generate a secret value is to run the following command:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'));"
```

You will need values for `JWT_SECRET_KEY`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, and `AUTHORIZATION_CODE`.

### 4. Set the environment variables for the cloned repository
- If you're running this in a development environment, create a copy of `example.development.env` and save it as `development.env`.
- If you're running this in a production environment, create a copy of `example.production.env` and save it as `production.env`.
- Replace `JWT_SECRET_KEY`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, and `AUTHORIZATION_CODE` in `development.env` or `production.env` with your generated values. These values will be used to configure the sample proxy's mock authentication server.
- Replace `JPM_CLIENT_ID` and `JPM_SECRET_KEY` in `development.env` or `production.env` with your keys from JPMorgan account. These values will be used to authorize in JPMorgan and retrieve the access token.

⚠️ Never commit real credentials to the repository.
Store secrets in environment variables or a secure secret manager.

### 5. Install dependencies
Run the following command to install the necessary dependencies:

```bash
npm install
```

### 6. Running the proxy server
#### Development mode:
Start the proxy server in development mode by running

```bash
npm run dev
```

This will create a local server on the port in the `development.env` file (port 3000 by default) that listens for local changes that trigger a rebuild.

#### Production mode:
Start the proxy server in production mode by running
```bash
npm run build
npm run start
```

This will start a production build on the port in the `production.env` file (port 3000 by default).

## Set up ngrok
### 1. [Install and configure ngrok for your machine.](https://ngrok.com/docs/getting-started/)
### 2. Start ngrok
Run the following command to create a publicly accessible tunnel to your localhost:

```bash
ngrok http <PORT>
```

Replace `<PORT>` with the port number in the `development.env` or `production.env` file.

### 3. Save the forwarding address
Copy the `Forwarding` address from the response. You’ll need this address in your `manifest.json` file.

```bash
ngrok

Send your ngrok traffic logs to Datadog: https://ngrok.com/blog-post/datadog-log

Session Status                online
Account                       email@domain.com (Plan: Free)
Update                        update available (version 3.3.1, Ctrl-U to update)
Version                       3.3.0
Region                        United States (us)
Latency                       60ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://bbd7-12-202-171-35.ngrok-free.app -> http:

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

In this example, the `Forwarding` address to copy is `https://bbd7-12-202-171-35.ngrok-free.app`.

## Create an extension app
### 1. Prepare your app manifest
Choose a manifest from the [manifests](manifests/) folder based on the appropriate [authentication](#authentication) use case. Replace `<PROXY_BASE_URL>` in your manifest.json file with the ngrok forwarding address in the following sections:
- `connections.params.customConfig.tokenUrl`
- `connections.params.customConfig.authorizationUrl`
- `actions.params.uri`

Update the following variables in your manifest.json file with the corresponding environment variables:
- Set the `CLIENT_ID` value in your manifest.json file to the same value as `OAUTH_CLIENT_ID`.
- Set the `CLIENT_SECRET` value in your manifest.json file to the same value as `OAUTH_CLIENT_SECRET`.

### 2. Navigate to the Docusign [Developer Console](https://devconsole.docusign.com/)
Log in with your Docusign developer credentials.

### 3. Upload your manifest
Register your extension app by [uploading your app manifest](https://developers.docusign.com/extension-apps/build-an-extension-app/register/use-manifest/).

## Test the extension app

[Test your extension app](https://developers.docusign.com/extension-apps/build-an-extension-app/test/). Extension app tests include [integration tests](https://developers.docusign.com/extension-apps/build-an-extension-app/test/integration-tests/) (connection tests and extension tests), [functional tests](https://developers.docusign.com/extension-apps/build-an-extension-app/test/functional-tests/), and [App Center preview](https://developers.docusign.com/extension-apps/build-an-extension-app/test/app-center-preview/).

### **Search records**
For the data search records extensions, this implementation uses the JP Morgan entity and account verifications to check the data. [Test your extension](https://developers.docusign.com/extension-apps/build-an-extension-app/test/) using the sample data below:

  - `DataIO.Version6.SearchRecords`: This action will send the data that identifies entity and account and checks them using JPMorgan API.

    Example JSON request body:

    ```
    {
        "query": {
            "$class": "com.docusign.connected.data.queries@1.0.0.Query",
            "attributesToSelect": [
            "verified",
            "verificationHeader",
            "verificationMessage"
            ],
            "from": "Entity",
            "queryFilter": {
            "$class": "com.docusign.connected.data.queries@1.0.0.QueryFilter",
            "operation": {
                "$class": "com.docusign.connected.data.queries@1.0.0.LogicalOperation",
                "leftOperation": {
                "$class": "com.docusign.connected.data.queries@1.0.0.ComparisonOperation",
                "leftOperand": {
                    "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                    "name": "firstName",
                    "type": "STRING",
                    "isLiteral": false
                },
                "operator": "EQUALS",
                "rightOperand": {
                    "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                    "name": "John",
                    "type": "STRING",
                    "isLiteral": true
                }
                },
                "operator": "AND",
                "rightOperation": {
                "$class": "com.docusign.connected.data.queries@1.0.0.LogicalOperation",
                "leftOperation": {
                    "$class": "com.docusign.connected.data.queries@1.0.0.ComparisonOperation",
                    "leftOperand": {
                    "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                    "name": "lastName",
                    "type": "STRING",
                    "isLiteral": false
                    },
                    "operator": "EQUALS",
                    "rightOperand": {
                    "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                    "name": "Doe",
                    "type": "STRING",
                    "isLiteral": true
                    }
                },
                "operator": "AND",
                "rightOperation": {
                    "$class": "com.docusign.connected.data.queries@1.0.0.LogicalOperation",
                    "leftOperation": {
                    "$class": "com.docusign.connected.data.queries@1.0.0.ComparisonOperation",
                    "leftOperand": {
                        "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                        "name": "fullName",
                        "type": "STRING",
                        "isLiteral": false
                    },
                    "operator": "EQUALS",
                    "rightOperand": {
                        "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                        "name": "John Doe",
                        "type": "STRING",
                        "isLiteral": true
                    }
                    },
                    "operator": "AND",
                    "rightOperation": {
                    "$class": "com.docusign.connected.data.queries@1.0.0.LogicalOperation",
                    "leftOperation": {
                        "$class": "com.docusign.connected.data.queries@1.0.0.ComparisonOperation",
                        "leftOperand": {
                        "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                        "name": "addressLine",
                        "type": "STRING",
                        "isLiteral": false
                        },
                        "operator": "EQUALS",
                        "rightOperand": {
                        "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                        "name": "New York, Shevchenka St., 1",
                        "type": "STRING",
                        "isLiteral": true
                        }
                    },
                    "operator": "AND",
                    "rightOperation": {
                        "$class": "com.docusign.connected.data.queries@1.0.0.LogicalOperation",
                        "leftOperation": {
                        "$class": "com.docusign.connected.data.queries@1.0.0.ComparisonOperation",
                        "leftOperand": {
                            "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                            "name": "country",
                            "type": "STRING",
                            "isLiteral": false
                        },
                        "operator": "EQUALS",
                        "rightOperand": {
                            "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                            "name": "US",
                            "type": "STRING",
                            "isLiteral": true
                        }
                        },
                        "operator": "AND",
                        "rightOperation": {
                        "$class": "com.docusign.connected.data.queries@1.0.0.LogicalOperation",
                        "leftOperation": {
                            "$class": "com.docusign.connected.data.queries@1.0.0.ComparisonOperation",
                            "leftOperand": {
                            "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                            "name": "townName",
                            "type": "STRING",
                            "isLiteral": false
                            },
                            "operator": "EQUALS",
                            "rightOperand": {
                            "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                            "name": "New York",
                            "type": "STRING",
                            "isLiteral": true
                            }
                        },
                        "operator": "AND",
                        "rightOperation": {
                            "$class": "com.docusign.connected.data.queries@1.0.0.LogicalOperation",
                            "leftOperation": {
                            "$class": "com.docusign.connected.data.queries@1.0.0.ComparisonOperation",
                            "leftOperand": {
                                "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                                "name": "dateOfBirth",
                                "type": "STRING",
                                "isLiteral": false
                            },
                            "operator": "EQUALS",
                            "rightOperand": {
                                "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                                "name": "2000/03/01",
                                "type": "STRING",
                                "isLiteral": true
                            }
                            },
                            "operator": "AND",
                            "rightOperation": {
                            "$class": "com.docusign.connected.data.queries@1.0.0.LogicalOperation",
                            "leftOperation": {
                                "$class": "com.docusign.connected.data.queries@1.0.0.ComparisonOperation",
                                "leftOperand": {
                                "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                                "name": "id",
                                "type": "STRING",
                                "isLiteral": false
                                },
                                "operator": "EQUALS",
                                "rightOperand": {
                                "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                                "name": "111223333",
                                "type": "STRING",
                                "isLiteral": true
                                }
                            },
                            "operator": "AND",
                            "rightOperation": {
                                "$class": "com.docusign.connected.data.queries@1.0.0.LogicalOperation",
                                "leftOperation": {
                                "$class": "com.docusign.connected.data.queries@1.0.0.ComparisonOperation",
                                "leftOperand": {
                                    "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                                    "name": "idType",
                                    "type": "STRING",
                                    "isLiteral": false
                                },
                                "operator": "EQUALS",
                                "rightOperand": {
                                    "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                                    "name": "SSN",
                                    "type": "STRING",
                                    "isLiteral": true
                                }
                                },
                                "operator": "AND",
                                "rightOperation": {
                                "$class": "com.docusign.connected.data.queries@1.0.0.ComparisonOperation",
                                "leftOperand": {
                                    "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                                    "name": "email",
                                    "type": "STRING",
                                    "isLiteral": false
                                },
                                "operator": "EQUALS",
                                "rightOperand": {
                                    "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                                    "name": "john.doe@example.com",
                                    "type": "STRING",
                                    "isLiteral": true
                                }
                                }
                            }
                            }
                        }
                        }
                    }
                    }
                }
                }
            }
            }
        },
        "pagination": {
            "limit": 10,
            "skip": 10
        }
    }
    ```

    Example JSON response:

    ```
    {
        "records": [
            {
                "verified": true,
                "message": "Successful verification"
            }
        ]
    }
    ```

## Troubleshooting

Common issues:

ngrok URL changed
→ update manifest.json

401 from JPMorgan API
→ check JPM_CLIENT_ID and JPM_SECRET_KEY

Connection test failed in DocuSign
→ verify proxy server is running

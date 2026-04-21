locals {
  application_service_url = trimsuffix(aws_lightsail_container_service.this.url, "/")
}

resource "aws_lightsail_container_service" "this" {
  name  = var.application_name
  power = var.application_instance_power
  scale = var.application_instance_scale

  private_registry_access {
    ecr_image_puller_role {
      is_active = true
    }
  }

  tags = local.tags
}

resource "aws_lightsail_container_service_deployment_version" "this" {
  service_name = aws_lightsail_container_service.this.name

  container {
    container_name = var.application_name
    image          = module.image.app_image_name

    environment = {
      JWT_SECRET_KEY      = local.application_jwt_secret_key
      OAUTH_CLIENT_ID     = local.application_oauth_client_id
      OAUTH_CLIENT_SECRET = local.application_oauth_client_secret
      AUTHORIZATION_CODE  = local.application_authorization_code
      JPM_AUTH_URL        = local.application_jpm_auth_url
      JPM_REQUEST_URL     = local.application_jpm_request_url
      JPM_CLIENT_ID       = local.application_jpm_client_id
      JPM_SECRET_KEY      = local.application_jpm_secret_key
    }

    ports = {
      (var.application_port) = "HTTP"
    }
  }

  public_endpoint {
    container_name = var.application_name
    container_port = var.application_port

    health_check {
      path          = "/"
      success_codes = "200-499"
    }
  }
}

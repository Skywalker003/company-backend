using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;

        public AuthController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("logout")]
        public IActionResult Logout() => Ok();

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var adminEmail    = _config["AdminUser:Email"];
            var adminPassword = _config["AdminUser:Password"];

            bool passwordValid = adminPassword != null && (
                adminPassword.StartsWith("$2")
                    ? BCrypt.Net.BCrypt.Verify(request.Password, adminPassword)
                    : request.Password == adminPassword
            );
            if (request.Email != adminEmail || !passwordValid)
                return Unauthorized(new { message = "Invalid email or password." });

            var token = GenerateToken(request.Email);
            return Ok(new { token, user = new { email = request.Email } });
        }

        private string GenerateToken(string email)
        {
            var key     = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds   = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var hours = double.TryParse(_config["Jwt:ExpiresHours"], out var h) ? h : 8;
            var expires = DateTime.UtcNow.AddHours(hours);

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var token = new JwtSecurityToken(
                issuer:             _config["Jwt:Issuer"],
                audience:           _config["Jwt:Audience"],
                claims:             claims,
                expires:            expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public record LoginRequest(string Email, string Password);
}

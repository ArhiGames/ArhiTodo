FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 5000
EXPOSE 5001

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release

COPY ["ArhiTodo.Api/ArhiTodo.Api.csproj", "ArhiTodo.Api/"]
COPY ["ArhiTodo.Application/ArhiTodo.Application.csproj", "ArhiTodo.Application/"]
COPY ["ArhiTodo.Domain/ArhiTodo.Domain.csproj", "ArhiTodo.Domain/"]
COPY ["ArhiTodo.Infrastructure/ArhiTodo.Infrastructure.csproj", "ArhiTodo.Infrastructure/"]

RUN dotnet restore "ArhiTodo.Api/ArhiTodo.Api.csproj"
COPY . .

RUN dotnet build "ArhiTodo.Api/ArhiTodo.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "ArhiTodo.Api/ArhiTodo.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ArhiTodo.Api.dll"]
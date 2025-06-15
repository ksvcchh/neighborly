FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY reviews.csproj ./
RUN dotnet restore

COPY . .
RUN dotnet publish \
    --configuration Release \
    --output /app/publish


FROM --platform=$TARGETPLATFORM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:5111
EXPOSE 5111
ENTRYPOINT ["dotnet", "reviews.dll"]

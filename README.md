# Hey Weather

Hey Weather är en vädertjänst byggd med React som visar aktuellt väder, rekommenderar aktiviteter och klädsel baserat på väderdata, samt anpassar bakgrunden dynamiskt efter vädret. Projektet använder modern CI/CD och distribueras i ett Kubernetes-kluster med hjälp av FluxCD.

## Funktioner
- Visa aktuellt väder och temperatur för användarens plats via geolokalisering.
- Möjlighet att söka väder på valfri plats.
- Rekommendationer för klädsel och aktiviteter baserat på vädret (via OpenAI API).
- Dynamiska bakgrunder som ändras efter vädret.
- CI/CD-pipeline för att automatisera bygg och driftsättning.

---

## Systemkrav

### Lokal utvecklingsmiljö:
- Node.js
- Docker 
- Kubernetes med kubectl installerat
- FluxCD CLI 
- En GitHub Personal Access Token (PAT) med admin-rättigheter
- OpenWeather API-nyckel
- OpenAI API-nyckel

### Deployment:
- Ett Google Kubernetes Engine (GKE) kluster eller annan kompatibel Kubernetes-miljö.
- GitHub Actions konfigurerat för CI.
- GitHub Container Registry (GHCR) för lagring av Docker-images.

---

## Installation och användning

### 1. Klona repot
```bash
git clone https://github.com/hejweather/hejweather.git
cd hejweather
```

### 2. Skapa en `.env`-fil
Lägg till dina API-nycklar i en `.env`-fil i projektmappen:
```env
REACT_APP_WEATHER_API_KEY=<din_openweather_api_nyckel>
REACT_APP_CHATGPT_API_KEY=<din_openai_api_nyckel>
```

### 3. Bygg och kör lokalt
1. Bygg och kör applikationen lokalt:
   ```bash
   npm install
   npm start
   ```

   ALternativt kör lokalt med docker:
   ```bash
   docker run -d --restart=always -p 3000:80 ghcr.io/hejweather/hejweatherapp:2617105056e119a5b627a557923050b1b593a75a
   c24fb5888c39a68a0973691fb3a811f5305414a9c42d43f5be99eb1ff5242920
   ```
2. Besök applikationen på `http://localhost:3000` 

---

## Deployment i Kubernetes

### 1. Skapa Docker-image (om du inte ska använda workflow) 
Bygg och push Docker-image till GitHub Container Registry:
```bash
docker build -t ghcr.io/<dittrepo/dinapp>:latest .
docker push ghcr.io/<dittrepo/dinapp>:latest
```

### 2. Skapa Kubernetes-manifest
Använd filerna i mappen `cluster/` för att konfigurera deployment och service:
- `kustomization.yaml`
- `deployment.yaml`
- `service.yaml`

### 3. Ändra workflow och lägg till github secrets
- Ändra alla namn och repositories i workflow-filen
- Lägg till Github secrets för token och miljövariablerna från din `.env`-fil.
- 
### 4. Installera FluxCD
Bootstrap FluxCD i ditt kluster:
```bash
flux bootstrap github \
  --owner=<your-org> \
  --repository=<your-repo> \
  --branch=main \
  --path=./cluster \
  --personal
```

### 5. Synkronisera och verifiera
Verifiera att Flux har synkroniserat konfigurationen:
```bash
kubectl get pods -n flux-system
kubectl get services -n default
```
Testa sedan applikationen genom att besöka IP-adressen för din LoadBalancer.

---

## CI/CD Pipeline
Projektet använder GitHub Actions för CI och FluxCD för CD:
1. Push av kod till `main`-branchen triggar en GitHub Actions workflow som:
   - Bygger en ny Docker-image.
   - Pushar imagen till GitHub Container Registry (GHCR).
   - Uppdaterar tag för applikationen i deployment
2. FluxCD övervakar repot för ändringar och uppdaterar Kubernetes-klustret med nya deployment-konfigurationer.

---

## Verktyg och teknologier
- **Frontend:** React, JavaScript
- **API:** OpenWeather, OpenAI
- **Containerisering:** Docker
- **Orkestrering:** Kubernetes
- **CI/CD:** GitHub Actions, FluxCD
- **Registry:** GitHub Container Registry (GHCR)

---

## Felsökning
1. **Fel vid bygg av Docker-image:**
   - Kontrollera att `.env`-variablerna är korrekt inställda.
   - Kontrollera Docker-versionen och rättigheter.

2. **Applikationen laddar inte i Kubernetes:**
   - Verifiera att FluxCD är korrekt installerat med `kubectl get pods -n flux-system`.
   - Kontrollera att LoadBalancer-adressen är korrekt i Kubernetes.

3. **Problem med API-anrop:**
   - Kontrollera att OpenWeather och OpenAI-nycklarna är giltiga och rätt konfigurerade.

---

## Kontakt och bidrag
Vi välkomnar förslag och bidrag till projektet. Skicka en pull request eller kontakta oss via [GitHub Issues](https://github.com/hejweather/hejweather/issues) för att rapportera buggar eller diskutera förbättringar.


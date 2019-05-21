import boto3, zipfile, StringIO, mimetypes

def lambda_handler(event, context):
    s3 = boto3.resource("s3")
    sns = boto3.resource('sns')
    
    try:
      topic = sns.Topic('arn:aws:sns:us-east-1:304945936761:deployMaxwellkendall')
      build_bucket = s3.Bucket("maxwellkendall.build")
      prod_bucket = s3.Bucket("maxwellkendall.com")
      inMemoryBuildZip = StringIO.StringIO()
      
      build_bucket.download_fileobj("maxwellkendall-build", inMemoryBuildZip)
      
      with zipfile.ZipFile(inMemoryBuildZip) as myzip:
        for nm in myzip.namelist():
            obj = myzip.open(nm)
            # removing prepended public/ for each build file
      
            if mimetypes.guess_type(nm)[0] != None:
              prod_bucket.upload_fileobj(obj, nm[7:],
              ExtraArgs={'ContentType': mimetypes.guess_type(nm)[0]})
              print nm, mimetypes.guess_type(nm)
            else:
              prod_bucket.upload_fileobj(obj, nm[7:])
            prod_bucket.Object(nm[7:]).Acl().put(ACL='public-read')
      
      topic.publish(Subject="Maxwellkendall.com | Successful Deploy", Message="Maxwellkendall.com was just deployed")
    except:
       topic.publish(Subject="Maxwellkendall.com | Failed Deploy", Message="Maxwellkendall.com just failed to deploy") 
       raise